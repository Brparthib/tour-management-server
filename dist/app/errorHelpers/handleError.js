"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = exports.handleValidationError = exports.handleCastError = exports.handleDuplicateError = void 0;
const handleDuplicateError = (err) => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists!!`,
    };
};
exports.handleDuplicateError = handleDuplicateError;
const handleCastError = (err) => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectId. Please provide a valid id",
    };
};
exports.handleCastError = handleCastError;
const handleValidationError = (err) => {
    const errorSources = [];
    const errors = Object.values(err.errors);
    errors.forEach((errObj) => errorSources.push({
        path: errObj.path,
        message: errObj.message,
    }));
    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources,
    };
};
exports.handleValidationError = handleValidationError;
const handleZodError = (err) => {
    const errorSources = [];
    err.issues.forEach((issue) => {
        errorSources.push({
            path: issue.path[issue.path.length - 1],
            // path: issue.path.length > 1 && issue.path.reverse().join(" inside "),
            message: issue.message,
        });
    });
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources,
    };
};
exports.handleZodError = handleZodError;
