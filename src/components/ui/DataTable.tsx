"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchableFields?: (keyof T)[];
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

type SortDirection = "asc" | "desc" | null;

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchableFields,
  emptyMessage = "No data found",
  className,
  onRowClick,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (accessor: string) => {
    if (sortColumn === accessor) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(accessor);
      setSortDirection("asc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...data];

    // Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) => {
        const fields = searchableFields || (Object.keys(row) as (keyof T)[]);
        return fields.some((field) => {
          const val = getNestedValue(row, String(field));
          return String(val ?? "")
            .toLowerCase()
            .includes(q);
        });
      });
    }

    // Sort
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const aVal = getNestedValue(a, sortColumn);
        const bVal = getNestedValue(b, sortColumn);
        const aStr = String(aVal ?? "");
        const bStr = String(bVal ?? "");

        const aNum = Number(aStr);
        const bNum = Number(bStr);

        let comparison: number;
        if (!isNaN(aNum) && !isNaN(bNum)) {
          comparison = aNum - bNum;
        } else {
          comparison = aStr.localeCompare(bStr);
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchQuery, sortColumn, sortDirection, searchableFields]);

  return (
    <div className={cn("glass-card overflow-hidden", className)}>
      {/* Search Bar */}
      <div className="px-5 py-4 border-b border-[rgba(139,92,246,0.1)]">
        <div className="glass-input flex items-center gap-2 px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-500 w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(139,92,246,0.08)]">
              {columns.map((col) => {
                const accessor = String(col.accessor);
                const isSorted = sortColumn === accessor;
                return (
                  <th
                    key={accessor}
                    className={cn(
                      "px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider",
                      col.sortable !== false &&
                        "cursor-pointer hover:text-slate-300 select-none"
                    )}
                    onClick={() => {
                      if (col.sortable !== false) handleSort(accessor);
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.header}
                      {col.sortable !== false && (
                        <span className="inline-flex">
                          {isSorted ? (
                            sortDirection === "asc" ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={cn(
                    "border-b border-[rgba(139,92,246,0.05)] hover:bg-[rgba(139,92,246,0.04)] transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => {
                    const accessor = String(col.accessor);
                    return (
                      <td
                        key={accessor}
                        className="px-5 py-3.5 text-sm text-slate-300"
                      >
                        {col.render
                          ? col.render(row)
                          : String(getNestedValue(row, accessor) ?? "")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
