import { apiGet } from "@/lib/api";
import type { AdminDashboardLite } from "./types";

export const getAdminDashboardLite = async () => {
  return apiGet<AdminDashboardLite>(`/api/admin/dashboard/lite`);
};
