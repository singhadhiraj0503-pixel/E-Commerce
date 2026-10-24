import CategoryDialog from "@/components/admin/products/CategoryDialog";
import ProductsToolbar from "@/components/admin/products/ProductsToolbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminProducts } from "@/features/admin/products/use-admin-products";
import React from "react";

const pageWrap = "space-y-6 p-6";

const cardClass = "border-border bg-card shadow-sm";

const cardHeaderClass = "space-y-4";

const cardTitleClass = "text-xl";

const cardContentClass = "space-y-4";

const AdminProducts = () => {
  const {
    search,
    setSearch,
    products,
    categories,
    loading,
    categoryDialogOpen,
    setCategoryDialogOpen,
    productDialogOpen,
    setProductDialogOpen,
    editingProduct,
    openCreateDialog,
    closeProductDialog,
    refreshAll,
    removeCategory,
  } = useAdminProducts();

  return (
    <div className={pageWrap}>
      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle className={cardTitleClass}>Products</CardTitle>
          <ProductsToolbar
            search={search}
            onSearchChange={setSearch}
            onManageCategories={() => setCategoryDialogOpen(true)}
            onAddProduct={openCreateDialog}
          />
        </CardHeader>
        <CardContent>Table</CardContent>
      </Card>

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        categories={categories}
        onSaved={refreshAll}
        onDeleteCategory={removeCategory}
      />
    </div>
  );
};

export default AdminProducts;
