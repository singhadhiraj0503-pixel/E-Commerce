import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BRANDS } from "@/features/admin/products/constants";
import type { Category, Product } from "@/features/admin/products/types";
import React from "react";
import ColorPicker from "./ColorPicker";
import SizeSelector from "./SizeSelector";
import ImagePicker from "./ImagePicker";
import { Button } from "@/components/ui/button";

type ProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  product: Product | null;
  onSaved: () => Promise<void>;
};

const dialogContentClass = "max-h-[92vh] overflow-y-auto sm:max-w-4xl";

const contentWrapClass = "grid gap-6";

const twoColumnGridClass = "grid gap-4 md:grid-cols-2";

const threeColumnGridClass = "grid gap-4 md:grid-cols-3";

const fieldGroupClass = "space-y-2";

const sectionGridClass = "grid gap-6 md:grid-cols-2";

const statusGroupClass =
  "flex gap-6 rounded-xl border border-border bg-card px-4 py-3";

const statusItemClass = "flex items-center space-x-2";

const actionsRowClass = "flex justify-end gap-3";

const ProductDialog = ({
  open,
  onOpenChange,
  categories,
  product,
  onSaved,
}: ProductDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>Add Products</DialogTitle>
        </DialogHeader>
        <div className={contentWrapClass}>
          <div className={twoColumnGridClass}>
            <div className={fieldGroupClass}>
              <Label>Title</Label>
              <Input placeholder="Enter Title ..." />
            </div>

            <div className={fieldGroupClass}>
              <Label>Brand</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand ..." />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map((brand) => {
                    return (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={fieldGroupClass}>
            <Label>Description</Label>
            <Textarea
              rows={5}
              placeholder="Enter Description here ..."
            ></Textarea>
          </div>

          <div className={twoColumnGridClass}>
            <div className={fieldGroupClass}>
              <Label>Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => {
                    return (
                      <SelectItem key={category._id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className={fieldGroupClass}>
              <Label>Status</Label>
              <RadioGroup className={statusGroupClass}>
                <div className={statusItemClass}>
                  <RadioGroupItem value={"active"} id="product-status-active" />
                  <Label htmlFor="product-status-active">Active</Label>
                </div>

                <div className={statusItemClass}>
                  <RadioGroupItem
                    value={"inactive"}
                    id="product-status-inactive"
                  />
                  <Label htmlFor="product-status-inactive">In-Active</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className={threeColumnGridClass}>
            <div className={fieldGroupClass}>
              <Label>Price</Label>
              <Input type="number" min={"0"} placeholder="0" />
            </div>

            <div className={fieldGroupClass}>
              <Label>Sale Percentage (%)</Label>
              <Input type="number" min={"0"} placeholder="0" />
            </div>

            <div className={fieldGroupClass}>
              <Label>Stock</Label>
              <Input type="number" min={"0"} placeholder="0" />
            </div>
          </div>

          <div className={sectionGridClass}>
            <ColorPicker />

            <SizeSelector />
          </div>

          <ImagePicker />

          <div className={actionsRowClass}>
            <Button
              variant={"outline"}
              onClick={() => onOpenChange(false)}
              className={"cursor-pointer"}
            >
              Cancel
            </Button>

            <Button className={"cursor-pointer"}>Create Product</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
