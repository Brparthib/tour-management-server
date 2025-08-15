"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpRoutes = void 0;
const express_1 = require("express");
const otp_controller_1 = require("./otp.controller");
const router = (0, express_1.Router)();
router.post("/send", otp_controller_1.otpControllers.sendOTP);
router.post("/verify", otp_controller_1.otpControllers.verifyOTP);
exports.otpRoutes = router;
