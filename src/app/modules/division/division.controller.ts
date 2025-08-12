import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { divisionServices } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import { IDivision } from "./division.interface";

const createDivision = catchAsync(async (req: Request, res: Response) => {
  const payload: IDivision = {
    ...req.body,
    thumbnail: req.file?.path,
  };
  const division = await divisionServices.createDivision(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Division Created Successfully.",
    data: division,
  });
});

const getAllDivision = catchAsync(async (req: Request, res: Response) => {
  const divisions = await divisionServices.getAllDivision();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Divisions Retrieved Successfully.",
    data: divisions.data,
    meta: divisions.meta,
  });
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const division = await divisionServices.getSingleDivision(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Division Retrieved Successfully.",
    data: division,
  });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload: IDivision = {
    ...req.body,
    thumbnail: req.file?.path,
  };
  const division = await divisionServices.updateDivision(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Division Updated Successfully.",
    data: division,
  });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const deletedDivision = await divisionServices.deleteDivision(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Division Deleted Successfully.",
    data: deletedDivision,
  });
});

export const divisionControllers = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
