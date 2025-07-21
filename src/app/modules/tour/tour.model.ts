import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: { types: [String], default: [] },
    location: { types: String },
    costFrom: { types: String },
    startDate: { types: Date },
    endDate: { types: Date },
    included: { types: [String], default: [] },
    excluded: { types: [String], default: [] },
    amenities: { types: [String], default: [] },
    tourPlan: { types: [String], default: [] },
    maxGuest: { types: Number },
    minAge: { types: Number },
    division: {
      types: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      types: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Tour = model<ITour>("Tour", tourSchema);
