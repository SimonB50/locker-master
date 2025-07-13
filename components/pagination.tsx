"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Pagination({ itemCount }: { itemCount: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemLimit = Number(searchParams.get("limit")) || 20;
  const totalPages = Math.ceil(itemCount / itemLimit);

  const params = new URLSearchParams(searchParams);
  return (
    <div className="flex flex-row justify-center items-center gap-4">
      <label className="select">
        <span className="label">Limit</span>
        <select
          className="min-w-24"
          onChange={(e) => {
            params.set("limit", e.target.value);
            params.delete("page");
            replace(`${pathname}?${params.toString()}`);
          }}
          value={itemLimit}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={40}>40</option>
          <option value={80}>80</option>
        </select>
      </label>
      {totalPages > 1 && (
        <div className="join">
          <button
            className="join-item btn"
            disabled={currentPage === 1}
            onClick={() => {
              params.set("page", String(currentPage - 1));
              replace(`${pathname}?${params.toString()}`);
            }}
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
            )
            .reduce((acc: number[], page, idx, arr) => {
              if (idx > 0 && page - arr[idx - 1] > 1) acc.push(-1);
              acc.push(page);
              return acc;
            }, [])
            .map((page, idx) =>
              page === -1 ? (
                <span key={`ellipsis-${idx}`} className="join-item btn btn-disabled">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  className={`join-item btn ${page === currentPage ? "btn-primary" : ""}`}
                  onClick={() => {
                    params.set("page", String(page));
                    replace(`${pathname}?${params.toString()}`);
                  }}
                >
                  {page}
                </button>
              )
            )}
          <button
            className="join-item btn"
            disabled={currentPage === totalPages}
            onClick={() => {
              params.set("page", String(currentPage + 1));
              replace(`${pathname}?${params.toString()}`);
            }}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}
