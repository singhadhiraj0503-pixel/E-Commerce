import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  createAdminCategories,
  updateAdminCategories,
} from "@/features/admin/products/api";
import type { Category } from "@/features/admin/products/types";
import { Pencil, Tag, Trash2 } from "lucide-react";
import React, { useState } from "react";

const dialogContentClass = "sm:max-w-xl";

const contentWrap = "space-y-4";

const formRow = "flex gap-3";

const categoriesList = "space-y-2";

const categoryRow =
  "flex items-center justify-between rounded-xl border border-border bg-card px-3 py-3";

const categoryInfo = "flex items-center gap-2";

const categoryIcon = "h-4 w-4 text-muted-foreground";

const categoryName = "text-sm font-medium text-foreground";

const emptyStateClass =
  "rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground";

const editButtonClass = "h-4 w-4";

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSaved: () => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
};

const CategoryDialog = ({
  open,
  onOpenChange,
  categories,
  onSaved,
  onDeleteCategory,
}: CategoryDialogProps) => {
  const [name, setName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const safeCategories = Array.isArray(categories) ? categories : [];

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      setSaving(true);

      if (editingCategory) {
        await updateAdminCategories(editingCategory._id, { name: name.trim() });
      } else {
        await createAdminCategories({ name: name.trim() });
      }
      setName("");
      setEditingCategory(null);
      await onSaved();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (getCurrentCategory: Category) => {
    setEditingCategory(getCurrentCategory);
    setName(getCurrentCategory.name);
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      await onDeleteCategory(category._id);

      if (editingCategory?._id === category._id) {
        setEditingCategory(null);
        setName("");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setName("");
      setEditingCategory(null);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <div className={contentWrap}>
          <div className={formRow}>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={"Enter Category name you want to add ..."}
            />
            <Button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className={"cursor-pointer"}
            >
              {editingCategory ? "Update" : "Add"}
            </Button>
          </div>

          <Separator />

          <div className={categoriesList}>
            {safeCategories.map((category) => {
              return (
                <div key={category._id} className={categoryRow}>
                  <div className={categoryInfo}>
                    <Tag className={categoryIcon} />
                    <span className={categoryName}>{category.name}</span>
                  </div>

                  <div>
                    <Button
                      className={"cursor-pointer"}
                      type="button"
                      size={"icon"}
                      variant={"ghost"}
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className={editButtonClass} />
                    </Button>
                    <Button
                      className="cursor-pointer"
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={saving}
                      onClick={() => void handleDelete(category)}
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
