import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { QueryBuilder } from "../../utils/queryBuilder";
import { tourSearchableField } from "./tour.constant";
import { deleteImageFromCloudinary } from "../../configs/cloudinary.config";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A tour with this title already exist!!"
    );
  }

  const tour = await Tour.create(payload);

  return tour;
};

const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tours = await queryBuilder
    .search(tourSearchableField)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);
  if (!existingTour) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour Not Found!!");
  }

  if (
    payload.images &&
    payload.images.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    payload.images = [...existingTour.images, ...payload.images];
  }

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    const restImg = existingTour.images.filter(
      (url) => !payload.deleteImages?.includes(url)
    );

    const updatedPayloadImages = (payload.images || [])
      .filter((url) => !payload.deleteImages?.includes(url))
      .filter((url) => !restImg.includes(url));

    payload.images = [...restImg, ...updatedPayloadImages];
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (payload.deleteImages && payload.deleteImages.length > 0) {
    await Promise.all(
      payload.deleteImages.map((url) => deleteImageFromCloudinary(url))
    );
  }
  
  return updatedTour;
};

const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};

// ------------- Tour Type ------------
const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload.name });
  if (existingTourType) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour Type Already Exist!!");
  }

  return await TourType.create({ name: payload.name });
};

const getAllTourTypes = async () => {
  const tourTypes = await TourType.find();
  if (!tourTypes) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour Types Not Found!!");
  }
  const totalTourTypes = await TourType.countDocuments();

  return {
    data: tourTypes,
    meta: {
      total: totalTourTypes,
    },
  };
};

const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour Type Not Found!!");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedTourType;
};

const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour Type Not Found!!");
  }

  return await TourType.findByIdAndDelete(id);
};

export const tourServices = {
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
};
