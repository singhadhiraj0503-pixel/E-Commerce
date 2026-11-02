import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { AdminPromosResponse, PromoFormValues } from "./types";

export const getAdminPromos = async () => {
  return apiGet<AdminPromosResponse>("/api/admin/promos");
};

export const createAdminPromos = async (body: PromoFormValues) => {
  return apiPost<AdminPromosResponse, PromoFormValues>(
    "/api/admin/promos",
    body,
  );
};

export const updateAdminPromos = async (
  promoId: string,
  body: PromoFormValues,
) => {
  return apiPatch<AdminPromosResponse, PromoFormValues>(
    `/api/admin/promos/${promoId}`,
    body,
  );
};

export const deleteAdminPromos = async (promoId: string) => {
  return apiDelete<AdminPromosResponse>(`/api/admin/promos/${promoId}`);
};
