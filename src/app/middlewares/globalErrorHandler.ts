/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../configs/env";
import AppError from "../errorHelpers/AppError";
import {
  handleCastError,
  handleDuplicateError,
  handleValidationError,
  handleZodError,
} from "../errorHelpers/handleError";
import { TErrorSources } from "../interfaces/error.types";
import { deleteImageFromCloudinary } from "../configs/cloudinary.config";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }

  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }

  const files = req.files as Express.Multer.File[];
  if (files && files.length > 0) {
    console.log(files);
    await Promise.all(
      files.map((file) => deleteImageFromCloudinary(file.path))
    );
  }

  let statusCode = 500;
  let message = `Something went wrong!!`;
  let errorSources: TErrorSources[] = [];

  // MongoDB Duplicate Error
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Mongoose Cast Error
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  // Zod Error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    simplifiedError.statusCode = 400;
    simplifiedError.message = "Zod Error";
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  // Custom Error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Express Error
  else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).send({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
