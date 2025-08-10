/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { sslService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";

const getTransactionId = () => {
  return `Tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);
    if (!user?.phone || !user.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please update your profile to book a tour!!"
      );
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");
    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found!");
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount!);

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    const transactionId = getTransactionId();

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    const address = (updatedBooking?.user as any).address;
    const email = (updatedBooking?.user as any).email;
    const phoneNumber = (updatedBooking?.user as any).phone;
    const name = (updatedBooking?.user as any).name;

    // SSLCommerz
    const sslPayload: ISSLCommerz = {
      transactionId,
      amount,
      name,
      email,
      phoneNumber,
      address,
    };

    const sslPayment = await sslService.sslPaymentInit(sslPayload);

    await session.commitTransaction(); // Transaction
    session.endSession();

    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (error) {
    await session.abortTransaction(); // rollBack
    session.endSession();
    throw error;
  }
};

const getAllBookings = async () => {
  const bookings = await Booking.find({});
  if (!bookings) {
    throw new AppError(httpStatus.BAD_REQUEST, "Bookings not found!!");
  }

  return bookings;
};

const getUserBookings = async (userId: string) => {
  const userBookings = await Booking.find({ user: userId });
  if (!userBookings) {
    throw new AppError(httpStatus.BAD_REQUEST, "Bookings not found!!");
  }

  return userBookings;
};

const getBookingById = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking not found!!");
  }

  return booking;
};

const updateBookingStatus = async (bookingId: string, status: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking not found!!");
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { status },
    { new: true, runValidators: true }
  );

  return updatedBooking;
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
};
