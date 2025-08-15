"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionZodSchema = exports.createDivisionZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Division name is required!!" })
        .min(1, { message: "Division name must be at least one character." }),
    slug: zod_1.default.string().optional(),
    thumbnail: zod_1.default.string().optional(),
    description: zod_1.default.string().optional(),
});
exports.updateDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Division name is required!!" })
        .min(1, { message: "Division name must be at least one character." })
        .optional(),
    slug: zod_1.default.string().optional(),
    thumbnail: zod_1.default.string().optional(),
    description: zod_1.default.string().optional(),
});
