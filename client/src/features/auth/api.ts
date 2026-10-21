import { apiGet, apiPost } from "@/lib/api";
import type { MeResponse, SyncResponse } from "./types";

export const syncUser = () => {
  return apiPost<SyncResponse>("/api/auth/sync");
};

export const getMe = () => {
  return apiGet<MeResponse>("/api/auth/me");
};
