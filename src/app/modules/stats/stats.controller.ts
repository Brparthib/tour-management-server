import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { statsServices } from "./stats.service";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await statsServices.getUserStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User stats fetched successfully",
    data: stats,
  });
});

const getTourStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await statsServices.getTourStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour stats fetched successfully",
    data: stats,
  });
});

const getBookingStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await statsServices.getBookingStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking stats fetched successfully",
    data: stats,
  });
});

const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await statsServices.getPaymentStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment stats fetched successfully",
    data: stats,
  });
});

export const statsControllers = {
  getBookingStats,
  getPaymentStats,
  getTourStats,
  getUserStats,
};
