import { fail } from "../utils/envelope.js";
export const notFOund = (req, res) => {
    res.status(404).json(fail(`Route not found ${req.method}`));
};
//# sourceMappingURL=notFound.js.map