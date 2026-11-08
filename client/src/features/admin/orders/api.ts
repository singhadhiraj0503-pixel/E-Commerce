import { apiGet, apiPatch } from "@/lib/api";
import type {
  AdminOrdersResponse,
  AdminOrderStatus,
  AdminUpdateOrderStatusResponse,
} from "./types";

export const extractAdminOrders = async () => {
  return apiGet<AdminOrdersResponse>(`/api/admin/orders`);
};

export const updateAdminOrderStatus = async (
  orderId: string,
  orderStatus: AdminOrderStatus,
) => {
  return apiPatch<
    AdminUpdateOrderStatusResponse,
    { orderStatus: AdminOrderStatus }
  >(`/api/admin/orders/${orderId}/status`, { orderStatus });
};
