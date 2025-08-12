import { Router } from "express";
import { tourControllers } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createTourZodSchema,
  TourTypeZodSchema,
  updateTourZodSchema,
} from "./tour.validation";
import { multerUpload } from "../../configs/multer.config";

const router = Router();
// ------------- Tour Routes --------------
router.get("/", tourControllers.getAllTours);
router.post(
  "/create-tour",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.array("files"),
  validateRequest(createTourZodSchema),
  tourControllers.createTour
);
router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.array("files"),
  validateRequest(updateTourZodSchema),
  tourControllers.updateTour
);
router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  tourControllers.deleteTour
);

// ----------- Tour Type Routes ------------
router.get("/tour-type", tourControllers.getAllTourTypes);
router.post(
  "/create-tour-type",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(TourTypeZodSchema),
  tourControllers.createTourType
);
router.patch(
  "/tour-type/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(TourTypeZodSchema),
  tourControllers.updateTourType
);
router.delete(
  "/tour-type/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  tourControllers.deleteTourType
);

export const tourRoutes = router;
