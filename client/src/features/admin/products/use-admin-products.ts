import { useCallback, useEffect, useState } from "react";
import type { Category, Product } from "./types";
import {
  deleteAdminCategory,
  getAdminCategories,
  getAdminProducts,
} from "./api";

export const useAdminProducts = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getAdminCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetching categories failed:", error);
      setCategories([]);
    }
  }, []);

  const removeCategory = useCallback(
    async (categoryId: string) => {
      await deleteAdminCategory(categoryId);

      // Update the category list immediately after successful deletion.
      await loadCategories();
    },
    [loadCategories],
  );

  const loadProducts = useCallback(async (searchValue = "") => {
    setLoading(true);
    try {
      const data = await getAdminProducts(searchValue);
      setProducts(data ?? []);
    } catch (error) {
      console.error("fetching failed", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const openCreateDialog = () => {
    setEditingProduct(null);
    setProductDialogOpen(true);
  };

  const closeProductDialog = () => {
    setProductDialogOpen(false);
    setEditingProduct(null);
  };

  const refreshAll = useCallback(async () => {
    await Promise.all([loadCategories(), loadProducts(search)]);
  }, [loadCategories, loadProducts, search]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProducts(search);
    }, 250);

    return () => clearTimeout(timer);
  }, [search, loadProducts]);

  return {
    search,
    setSearch,
    products,
    categories,
    loading,
    refreshAll,
    removeCategory,
    categoryDialogOpen,
    setCategoryDialogOpen,
    productDialogOpen,
    setProductDialogOpen,
    editingProduct,
    openCreateDialog,
    closeProductDialog,
  };
};
