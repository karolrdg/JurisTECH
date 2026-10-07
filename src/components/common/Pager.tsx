import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function usePaged<T>(items: T[], pageSize = 8) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  useEffect(() => {
    if (page > pages) setPage(1);
  }, [page, pages]);
  return { page, pages, setPage, slice: items.slice((page - 1) * pageSize, page * pageSize), total: items.length };
}

export function Pager({ page, pages, total, setPage }: { page: number; pages: number; total: number; setPage: (p: number) => void }) {
  if (total === 0) return null;
  return (
    <nav aria-label="Paginação" className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
      <span>
        {total} registro{total > 1 ? "s" : ""} · página {page} de {pages}
      </span>
      <div className="flex gap-1">
        <Button variant="outline" size="icon" className="size-8" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Página anterior">
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="icon" className="size-8" disabled={page >= pages} onClick={() => setPage(page + 1)} aria-label="Próxima página">
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
