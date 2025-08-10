import { Router } from "express";
import { paymentControllers } from "./payment.controller";

const router = Router();

router.post("/init-payment/:bookingId", paymentControllers.initPayment );
router.post("/success", paymentControllers.successPayment);
router.post("/fail", paymentControllers.failPayment);
router.post("/cancel", paymentControllers.cancelPayment);

export const paymentRoutes = router;
