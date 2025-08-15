import { Router } from "express";
import { otpControllers } from "./otp.controller";

const router = Router();

router.post("/send", otpControllers.sendOTP);
router.post("/verify", otpControllers.verifyOTP);

export const otpRoutes = router;
