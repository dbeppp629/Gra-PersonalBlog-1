/**
 * 分页组件
 * 根据当前页码和总页数渲染分页导航
 * Client Component：包含交互逻辑
 */
"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 分页组件 Props
 * 注意：Server Component 不能向 Client Component 传函数，
 * 因此这里只接收可序列化的查询参数，URL 在组件内部拼接。
 */
interface PaginationProps {
  /** 当前页码（从 1 开始） */
  currentPage: number;
  /** 总页数 */
  totalPages: number;
  /** 基础路径，默认 "/" */
  basePath?: string;
  /** 需要保留的查询参数（如 tag、q），不包含 page */
  query?: Record<string, string | undefined>;
}

/**
 * 分页导航组件
 */
export function Pagination({
  currentPage,
  totalPages,
  basePath = "/",
  query = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  /**
   * 生成指定页码的链接
   * 第 1 页不携带 page 参数，保持 URL 干净
   */
  const getHref = (page: number): string => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
    const search = params.toString();
    return search ? `${basePath}?${search}` : basePath;
  };

  // 生成显示的页码列表（最多显示 7 个）
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // 当前页附近的逻辑
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="分页">
      {/* 上一页 */}
      <Link
        href={getHref(currentPage - 1)}
        className={cn(
          "p-2 rounded-lg transition-colors",
          currentPage <= 1
            ? "opacity-50 pointer-events-none"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {/* 页码 */}
      {pages.map((page, index) =>
        page === "..." ? (
          <span key={`dots-${index}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={getHref(page)}
            className={cn(
              "min-w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors",
              page === currentPage
                ? "bg-primary text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {/* 下一页 */}
      <Link
        href={getHref(currentPage + 1)}
        className={cn(
          "p-2 rounded-lg transition-colors",
          currentPage >= totalPages
            ? "opacity-50 pointer-events-none"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
        aria-disabled={currentPage >= totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </nav>
  );
}
