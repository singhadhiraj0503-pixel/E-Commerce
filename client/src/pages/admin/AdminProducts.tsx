import ProductsToolbar from "@/components/admin/products/ProductsToolbar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const pageWrap = "space-y-6 p-6";

const cardClass = "border-border bg-card shadow-sm";

const cardHeaderClass = "space-y-4";

const cardTitleClass = "text-xl";

const cardContentClass = "space-y-4";

const AdminProducts = () => {
  return (
    <div className={pageWrap}>
      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle className={cardTitleClass}>Products</CardTitle>
          <ProductsToolbar />
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminProducts;
