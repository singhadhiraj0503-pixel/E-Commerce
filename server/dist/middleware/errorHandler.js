import { AppError } from "../utils/AppError.js";
import { fail } from "../utils/envelope.js";
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json(fail(err.message, "APP_ERROR"));
    }
    console.error(err);
    return res.status(500).json(fail("Internal Server Error", "INTERNAL"));
};
//# sourceMappingURL=errorHandler.js.map