import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import React from "react";

const wrapperClass =
  "flex flex-col gap-3 md:flex-row md:items-center md:justify-between";

const searchWrapClass = "relative w-full md:w-80";

const searchIconClass =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground";

const searchInputClass = "pl-9";

const actionsWrapClass = "flex flex-col gap-3 sm:flex-row";

const addIconClass = "mr-2 h-4 w-4";

const ProductsToolbar = () => {
  return (
    <div className={wrapperClass}>
      <div className={searchWrapClass}>
        <Search className={searchIconClass} />
        <Input placeholder="Search Products..." className={searchInputClass} />
      </div>

      <div className={actionsWrapClass}>
        <Button className="cursor-pointer" variant={"outline"}>
          Manage Category
        </Button>
        <Button className="cursor-pointer">
          <Plus className={addIconClass} />
          Add Product
        </Button>
      </div>
    </div>
  );
};

export default ProductsToolbar;
