import { Router } from "express";
import { divisionControllers } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";
import { multerUpload } from "../../configs/multer.config";

const router = Router();

router.post(
  "/create-division",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.single("file"),
  validateRequest(createDivisionZodSchema),
  divisionControllers.createDivision
);
router.get("/", divisionControllers.getAllDivision);
router.get("/:slug", divisionControllers.getSingleDivision);
router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.single("file"),
  validateRequest(updateDivisionZodSchema),
  divisionControllers.updateDivision
);
router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  divisionControllers.deleteDivision
);

export const divisionRoutes = router;
