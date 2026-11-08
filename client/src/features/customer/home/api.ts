import { apiGet } from "@/lib/api";
import type { CustomerHomeResponse } from "./types";

export const getCustomerHomeDataOverview = async () => {
  return apiGet<CustomerHomeResponse>(`/api/customer/home`);
};
