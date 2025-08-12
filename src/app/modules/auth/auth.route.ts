import { Router } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../configs/env";

const router = Router();

router.post("/login", authControllers.credentialsLogin);
router.post("/refresh-token", authControllers.getNewAccessToken);
router.post("/logout", authControllers.logout);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  authControllers.changePassword
);
router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  authControllers.setPassword
);
router.post("/forgot-password", authControllers.forgotPassword);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  authControllers.resetPassword
);

router.get("/google", authControllers.passportAuthenticate);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issue with your account. Please contact with our support team.`,
  }),
  authControllers.googleCallBackController
);

export const authRoutes = router;
