import httpStatus from "http-status-codes";
import { Division } from "./division.model";
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { deleteImageFromCloudinary } from "../../configs/cloudinary.config";

const createDivision = async (payload: IDivision) => {
  const existingDivision = await Division.findOne({ name: payload.name });
  if (existingDivision) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Division with this name already exist!!"
    );
  }

  const division = await Division.create(payload);

  return division;
};

const getAllDivision = async () => {
  const divisions = await Division.find({});
  if (!divisions) {
    throw new AppError(httpStatus.NOT_FOUND, "No data found!!");
  }
  const totalDivision = await Division.countDocuments();

  return {
    data: divisions,
    meta: {
      total: totalDivision,
    },
  };
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  if (!division) {
    throw new AppError(httpStatus.NOT_FOUND, "Division Not Found!!");
  }

  return {
    data: division,
  };
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existingDivision = await Division.findById(id);
  if (!existingDivision) {
    throw new AppError(httpStatus.BAD_REQUEST, "Division not found!!");
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });
  if (duplicateDivision) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A division with this name already exist!!"
    );
  }

  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (payload.thumbnail && existingDivision.thumbnail) {
    await deleteImageFromCloudinary(existingDivision.thumbnail);
  }

  return updatedDivision;
};

const deleteDivision = async (id: string) => {
  const existingDivision = await Division.findById(id);
  if (existingDivision && existingDivision.thumbnail) {
    await deleteImageFromCloudinary(existingDivision.thumbnail);
  }

  await Division.findByIdAndDelete(id);

  return null;
};

export const divisionServices = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
