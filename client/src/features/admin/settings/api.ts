import { apiGet, apiPost } from "@/lib/api";
import type { AdminBannersResponse } from "./types";

export const getAdminBanners = async () => {
  return apiGet<AdminBannersResponse>("/api/admin/settings/banners");
};

export const uploadAdminBanners = async (formData: FormData) => {
  return apiPost<AdminBannersResponse, FormData>(
    "/api/admin/settings/banners",
    formData,
  );
};
