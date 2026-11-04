import { apiDelete, apiGet, apiPost } from "@/lib/api";
import type {
  AddCustomerWishlistItemBody,
  CustomerWishlistResponse,
} from "./types";

export const getCustomerWishlist = async () => {
  return apiGet<CustomerWishlistResponse>("/api/customer/wishlist");
};

export const addCustomerWishlist = async (
  body: AddCustomerWishlistItemBody,
) => {
  return apiPost<CustomerWishlistResponse, AddCustomerWishlistItemBody>(
    "/api/customer/wishlist/items",
    body,
  );
};

export const removeCustomerWishlistItem = async (productId: string) => {
  return apiDelete<CustomerWishlistResponse>(
    `/api/customer/wishlist/items/${productId}`,
  );
};
