"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourRoutes = void 0;
const express_1 = require("express");
const tour_controller_1 = require("./tour.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const tour_validation_1 = require("./tour.validation");
const multer_config_1 = require("../../configs/multer.config");
const router = (0, express_1.Router)();
// ------------- Tour Routes --------------
router.get("/", tour_controller_1.tourControllers.getAllTours);
router.post("/create-tour", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.ADMIN), multer_config_1.multerUpload.array("files"), (0, validateRequest_1.validateRequest)(tour_validation_1.createTourZodSchema), tour_controller_1.tourControllers.createTour);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.ADMIN), multer_config_1.multerUpload.array("files"), (0, validateRequest_1.validateRequest)(tour_validation_1.updateTourZodSchema), tour_controller_1.tourControllers.updateTour);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.ADMIN), tour_controller_1.tourControllers.deleteTour);
// ----------- Tour Type Routes ------------
router.get("/tour-type", tour_controller_1.tourControllers.getAllTourTypes);
router.post("/create-tour-type", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(tour_validation_1.TourTypeZodSchema), tour_controller_1.tourControllers.createTourType);
router.patch("/tour-type/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(tour_validation_1.TourTypeZodSchema), tour_controller_1.tourControllers.updateTourType);
router.delete("/tour-type/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.ADMIN), tour_controller_1.tourControllers.deleteTourType);
exports.tourRoutes = router;
