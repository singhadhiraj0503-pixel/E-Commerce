import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

const wrapClass =
  "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";

const searchWrapClass = "relative w-full max-w-sm";

const searchIconClass =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground";

const searchInputClass = "rounded pl-9";

const addButtonClass = "rounded cursor-pointer";

const addButtonIconClass = "mr-2 h-4 w-4";

type PromoToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onAddPromo: () => void;
};

const PromoToolbar = ({
  search,
  onSearchChange,
  onAddPromo,
}: PromoToolbarProps) => {
  return (
    <div className={wrapClass}>
      <div className={searchWrapClass}>
        <Search className={searchIconClass} />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className={searchInputClass}
          placeholder="Search Promos ..."
        />
      </div>

      <Button className={addButtonClass} onClick={onAddPromo}>
        <Plus className={addButtonIconClass} />
        Add Promo
      </Button>
    </div>
  );
};

export default PromoToolbar;
