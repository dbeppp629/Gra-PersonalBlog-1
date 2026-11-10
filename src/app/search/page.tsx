/**
 * 搜索页面
 * 用 Suspense 边界包裹使用 useSearchParams 的内部组件（Next.js App Router 要求）
 */
import { Suspense } from "react";
import { SearchContent } from "./search-content";

/**
 * 加载中的 fallback
 */
function SearchLoading() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">搜索文章</h1>
      <div className="h-12 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    </div>
  );
}

/**
 * 搜索页面根组件
 * 将使用 useSearchParams 的内容包裹在 Suspense 中
 */
export default function SearchPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">搜索文章</h1>
      <Suspense fallback={<SearchLoading />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
