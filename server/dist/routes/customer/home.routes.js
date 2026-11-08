import express from "express";
import { getCustomerHomeRoute } from "../../controllers/customer/home.controller.js";
export const customerHomeRouter = express.Router();
// fetch customer home route items
customerHomeRouter.get("/home", getCustomerHomeRoute);
//# sourceMappingURL=home.routes.js.map