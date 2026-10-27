import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type {
  Category,
  CreateCategoryBody,
  CreateProductBody,
  DeleteCategoryResponse,
  GetAdminProductsResponse,
  Product,
  UpdateCategoryBody,
  UpdateProductBody,
} from "./types";

// Category
export const getAdminCategories = async () => {
  return apiGet<Category[]>("/api/admin/categories");
};

export const createAdminCategories = async (body: CreateCategoryBody) => {
  return apiPost<{ category: Category }, CreateCategoryBody>(
    "/api/admin/categories",
    body,
  );
};

export const updateAdminCategories = async (
  categoryId: string,
  body: UpdateCategoryBody,
) => {
  return apiPut<Category, UpdateCategoryBody>(
    `/api/admin/categories/${categoryId}`,
    body,
  );
};

export const deleteAdminCategory = async (categoryId: string) => {
  return apiDelete<DeleteCategoryResponse>(
    `/api/admin/categories/${categoryId}`,
  );
};

// Products
export const getAdminProducts = async (search?: string) => {
  const query = search?.trim()
    ? `/api/admin/products?search=${encodeURIComponent(search.trim())}`
    : "/api/admin/products";

  const response = await apiGet<GetAdminProductsResponse>(query);

  return response.products;
};

export const getAdminProductById = async (productId: string) => {
  return apiGet<Product>(`/api/admin/products/${productId}`);
};

// Building product form data
const buildProductFormData = (
  body: CreateProductBody | UpdateProductBody,
  files: File[],
) => {
  const formData = new FormData();
  formData.append("title", body.title);
  formData.append("description", body.description);
  formData.append("category", body.category);
  formData.append("brand", body.brand);
  formData.append("price", String(body.price));
  formData.append("salePercentage", String(body.salePercentage));
  formData.append("stock", String(body.stock));
  formData.append("status", body.status);

  body.colors.forEach((color) => formData.append("colors", color));
  body.sizes.forEach((size) => formData.append("sizes", size));

  if ("existingImages" in body && body.existingImages) {
    formData.append("existingImages", JSON.stringify(body.existingImages));
  }

  if ("coverImagePublicId" in body && body.coverImagePublicId) {
    formData.append("coverImagePublicId", body.coverImagePublicId);
  }

  files.forEach((file) => formData.append("images", file));

  return formData;
};

export const createAdminProduct = async (
  body: CreateProductBody,
  files: File[],
) => {
  const formData = buildProductFormData(body, files);
  return apiPost<Product, FormData>("/api/admin/products", formData);
};

export const updateAdminProduct = async (
  productId: string,
  body: UpdateProductBody,
  files: File[],
) => {
  const formData = buildProductFormData(body, files);
  return apiPut<Product, FormData>(
    `/api/admin/products/${productId}`,
    formData,
  );
};
