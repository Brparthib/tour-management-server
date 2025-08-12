import { Router } from "express";
import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);
router.get(
  "/all-user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getAllUser
);
router.get("/me", checkAuth(...Object.values(Role)), userControllers.getMe);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getSingleUser
);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(updateZodSchema),
  userControllers.updateUser
);

export const userRoutes = router;
