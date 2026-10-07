import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchInput({
  value,
  onChange,
  placeholder = "Pesquisar...",
  label = "Pesquisar",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string | undefined;
  label?: string | undefined;
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input type="search" aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-card pl-9 pr-9" />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label="Limpar pesquisa" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
