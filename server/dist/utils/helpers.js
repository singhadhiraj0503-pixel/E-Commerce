import { AppError } from "./AppError.js";
export const requireText = (value, message, statusCode = 400) => {
    if (!String(value || "").trim()) {
        throw new AppError(statusCode, message);
    }
};
export const requireNumber = (value, message, statusCode = 400) => {
    if (Number.isNaN(value)) {
        throw new AppError(statusCode, message);
    }
};
export const requireFound = (value, message, statusCode = 404) => {
    if (!value) {
        throw new AppError(statusCode, message);
    }
    return value;
};
//# sourceMappingURL=helpers.js.map