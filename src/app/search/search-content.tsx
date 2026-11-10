/**
 * 搜索页面内容组件
 * Client Component：包含搜索输入交互，使用 useSearchParams
 * 注意：必须由父组件用 Suspense 包裹
 */
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";
import { getAllArticles } from "@/lib/data/articles";
import { ArticleList } from "@/components/articles/article-list";

/**
 * 搜索内容组件（内部 Client 组件，使用 useSearchParams）
 */
export function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(initialQuery);

  // URL 变化时同步到输入框
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setSubmitted(searchParams.get("q") || "");
  }, [searchParams]);

  // 搜索结果
  const results = useMemo(() => {
    if (!submitted.trim()) return [];
    const q = submitted.trim().toLowerCase();
    return getAllArticles().filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [submitted]);

  /**
   * 提交搜索
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(query);

    // 更新 URL 参数
    const url = query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search";
    router.push(url);
  };

  return (
    <>
      {/* 搜索表单 */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入关键词搜索文章标题、内容或标签..."
            autoFocus
            className="w-full pl-12 pr-12 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSubmitted("");
                router.push("/search");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* 搜索结果 */}
      {submitted.trim() ? (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            搜索 "<strong className="text-primary">{submitted}</strong>" 共找到{" "}
            <strong>{results.length}</strong> 篇文章
          </p>
          <ArticleList articles={results} />
        </div>
      ) : (
        // 搜索框为空时显示热门标签和热门文章
        <div className="p-8 text-center rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <SearchIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">输入关键词开始搜索</p>
          <div className="mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">试试这些：</span>
            {["Next.js", "React", "TypeScript", "TailwindCSS"].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="inline-block mx-1 text-sm text-primary hover:underline"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
