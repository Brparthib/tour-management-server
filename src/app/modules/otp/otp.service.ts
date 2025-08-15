import httpStatus from "http-status-codes";
import crypto from "crypto";
import { redisClient } from "../../configs/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";

const OTP_EXPIRATION = 2 * 60;

const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

  return otp;
};

const sendOTP = async (name: string, email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!!");
  }

  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are already verified!!");
  }

  const otp = generateOtp();

  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name: name,
      otp: otp,
    },
  });
};

const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!!");
  }

  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are already verified!!");
  }

  const redisKey = `otp:${email}`;
  const savedOTP = await redisClient.get(redisKey);
  if (!savedOTP) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP!!");
  }

  if (savedOTP !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP!!");
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del([redisKey]),
  ]);
};

export const otpServices = {
  sendOTP,
  verifyOTP,
};
