import { Router } from "express";
import { paymentControllers } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/init-payment/:bookingId", paymentControllers.initPayment);
router.post("/success", paymentControllers.successPayment);
router.post("/fail", paymentControllers.failPayment);
router.post("/cancel", paymentControllers.cancelPayment);
router.get(
  "/invoice/:paymentId",
  checkAuth(...Object.values(Role)),
  paymentControllers.getInvoiceDownloadUrl
);
router.post("/validate-payment", paymentControllers.validatePayment);

export const paymentRoutes = router;
