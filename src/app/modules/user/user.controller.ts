import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Created Successfully",
    data: user,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getAllUser();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users data retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await userServices.getSingleUser(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User data retrieved successfully",
    data: result.data,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const verifiedToken = req.user as JwtPayload;
  const result = await userServices.getMe(verifiedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My data retrieved successfully",
    data: result.data,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const verifiedToken = req.user;
  const payload = req.body;

  const user = await userServices.updateUser(
    userId,
    payload,
    verifiedToken as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Updated Successfully",
    data: user,
  });
});

export const userControllers = {
  createUser,
  getAllUser,
  getSingleUser,
  getMe,
  updateUser,
};
