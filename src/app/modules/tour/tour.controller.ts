import { ITour } from "./tour.interface";
import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { tourServices } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";

const createTour = catchAsync(async (req: Request, res: Response) => {
  const payload: ITour = {
    ...req.body,
    images: (req.files as Express.Multer.File[]).map((file) => file.path),
  };
  const tour = await tourServices.createTour(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tour Created Successfully.",
    data: tour,
  });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const tours = await tourServices.getAllTours(query as Record<string, string>);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour Retrieved Successfully.",
    data: tours.data,
    meta: tours.meta,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload: ITour = {
    ...req.body,
    images: (req.files as Express.Multer.File[]).map((file) => file.path),
  };
  const updatedTour = await tourServices.updateTour(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour Updated Successfully.",
    data: updatedTour,
  });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const tour = await tourServices.deleteTour(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour Deleted Successfully.",
    data: tour,
  });
});

// ----------------- TourType --------------------
const createTourType = catchAsync(async (req: Request, res: Response) => {
  const tourType = await tourServices.createTourType(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "TourType Created Successfully.",
    data: tourType,
  });
});

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
  const tourTypes = await tourServices.getAllTourTypes();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour Types Retrieved Successfully.",
    data: tourTypes.data,
    meta: tourTypes.meta,
  });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedTourType = await tourServices.updateTourType(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour Type Updated Successfully.",
    data: updatedTourType,
  });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const tourType = await tourServices.deleteTourType(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour Type Deleted Successfully.",
    data: tourType,
  });
});

export const tourControllers = {
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
};
