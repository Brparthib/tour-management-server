import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { statsControllers } from "./stats.controller";

const router = Router();

router.get(
  "/user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  statsControllers.getUserStats
);
router.get(
  "/tour",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  statsControllers.getTourStats
);
router.get(
  "/booking",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  statsControllers.getBookingStats
);
router.get(
  "/payment",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  statsControllers.getPaymentStats
);

export const statsRoutes = router;
