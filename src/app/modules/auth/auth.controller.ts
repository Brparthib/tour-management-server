/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import passport from "passport";
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../configs/env";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await authServices.credentialsLogin(req.body);
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(httpStatus.UNAUTHORIZED, err));
      }

      if (!user) {
        return next(new AppError(httpStatus.UNAUTHORIZED, info.message));
      }

      const userTokens = createUserTokens(user);

      setAuthCookie(res, userTokens);

      delete user.toObject().password;

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user,
        },
      });
    })(req, res, next);
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received!!");
    }

    const tokenInfo = await authServices.getNewAccessToken(
      refreshToken as string
    );

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User access token retrieved successfully",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged out successfully",
      data: null,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const { oldPassword, newPassword } = req.body;

    await authServices.changePassword(
      decodedToken as JwtPayload,
      oldPassword,
      newPassword
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);

const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { password } = req.body;

    await authServices.setPassword(decodedToken.userId, password);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Set Successfully",
      data: null,
    });
  }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authServices.forgotPassword(email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Email Send Successfully",
    data: null,
  });
});

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    await authServices.resetPassword(req.body, decodedToken as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Reset Successfully",
      data: null,
    });
  }
);

// Google
const passportAuthenticate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

const googleCallBackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    const tokenInfo = createUserTokens(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const authControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword,
  passportAuthenticate,
  googleCallBackController,
};
