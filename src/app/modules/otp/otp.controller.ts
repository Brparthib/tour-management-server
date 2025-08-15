import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { otpServices } from "./otp.service";

const sendOTP = catchAsync(async (req: Request, res: Response) => {
  const { name, email } = req.body;
  await otpServices.sendOTP(name, email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent successfully",
    data: null,
  });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await otpServices.verifyOTP(email, otp);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully",
    data: null,
  });
});

export const otpControllers = {
  sendOTP,
  verifyOTP,
};
