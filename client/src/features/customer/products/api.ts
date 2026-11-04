import { apiGet } from "@/lib/api";
import type {
  CustomerProduct,
  CustomerProductDetailsResponse,
  GetCustomerProductsParams,
  ProductCategory,
} from "./types";

export const getCustomerCategories = async () => {
  return apiGet<ProductCategory[]>("/api/customer/categories");
};

export const getCustomerProducts = async (
  params?: GetCustomerProductsParams,
) => {
  const searchParams = new URLSearchParams();

  if (params?.category) {
    searchParams.set("category", params.category);
  }

  if (params?.brand) {
    searchParams.set("brand", params.brand);
  }

  if (params?.color) {
    searchParams.set("color", params.color);
  }

  if (params?.size) {
    searchParams.set("size", params.size);
  }

  if (params?.sort) {
    searchParams.set("sort", params.sort);
  }

  const queryString = searchParams.toString();

  const url = queryString
    ? `/api/customer/products?${queryString}`
    : `/api/customer/products`;

  return apiGet<CustomerProduct[]>(url);
};

export const getCustomerProductDetails = async (productId: string) => {
  return apiGet<CustomerProductDetailsResponse>(
    `/api/customer/products/${productId}`,
  );
};
