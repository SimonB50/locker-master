"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Search } from "react-bootstrap-icons";

import { useRef } from "react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const params = new URLSearchParams(searchParams);
  return (
    <div className="flex flex-row justify-center items-center gap-4 my-4">
    <label className="input w-full">
      <Search className="h-[1em] opacity-50" />
      <input
        type="search"
        required
        placeholder="Wyszukaj"
        className="w-full"
        onChange={(e) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          const query = e.target.value.trim();
          timeoutRef.current = setTimeout(() => {
            if (query) {
              params.set("search", query);
              params.delete("page");
              params.delete("limit");
            } else {
              params.delete("search");
            }
            replace(`${pathname}?${params.toString()}`);
          }, 400);
        }}
      />
    </label>
    </div>
  );
}
