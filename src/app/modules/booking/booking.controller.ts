import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { bookingServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const verifiedToken = req.user as JwtPayload;
  const booking = await bookingServices.createBooking(
    req.body,
    verifiedToken.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking Created Successfully",
    data: booking,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const bookings = await bookingServices.getAllBookings();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings Retrieved Successfully",
    data: bookings,
  });
});

const getUserBookings = catchAsync(async (req: Request, res: Response) => {
  const verifiedToken = req.user as JwtPayload;
  const bookings = await bookingServices.getUserBookings(verifiedToken.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Bookings Retrieved Successfully",
    data: bookings,
  });
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const bookings = await bookingServices.getBookingById(bookingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking Retrieved Successfully",
    data: bookings,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const bookingId = req.params.bookingId;
  const bookings = await bookingServices.updateBookingStatus(bookingId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking Status Updated Successfully",
    data: bookings,
  });
});

export const bookingControllers = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
};
