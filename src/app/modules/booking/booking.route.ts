import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createBookingZodSchema,
  updateBookingZodSchema,
} from "./booking.validation";
import { bookingControllers } from "./booking.controller";

const router = Router();

//api/v1/booking
router.post(
  "/",
  checkAuth(...Object.values(Role)),
  validateRequest(createBookingZodSchema),
  bookingControllers.createBooking
);

//api/v1/booking
router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  bookingControllers.getAllBookings
);

//api/v1/booking/my-bookings
router.get(
  "/my-bookings",
  checkAuth(...Object.values(Role)),
  bookingControllers.getUserBookings
);

//api/v1/booking/:bookingId
router.get(
  "/:bookingId",
  checkAuth(...Object.values(Role)),
  bookingControllers.getBookingById
);

//api/v1/booking/bookingId/status
router.patch(
  "/:bookingId/status",
  checkAuth(...Object.values(Role)),
  validateRequest(updateBookingZodSchema),
  bookingControllers.updateBookingStatus
);

export const bookingRoutes = router;
