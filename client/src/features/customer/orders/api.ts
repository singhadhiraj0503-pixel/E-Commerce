import { apiGet, apiPatch } from "@/lib/api";
import type {
  CustomerOrdersResponse,
  CustomerReturnOrderResponse,
} from "./types";

export const getCustomerOrders = async () => {
  return apiGet<CustomerOrdersResponse>(`/api/customer/orders`);
};

export const returnCustomerOrder = async (orderId: string) => {
  return apiPatch<CustomerReturnOrderResponse>(
    `/api/customer/orders/${orderId}/return`,
  );
};
