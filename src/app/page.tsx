/**
 * 博客首页（SSR）
 * - 服务端获取文章列表
 * - 支持分页（通过 searchParams.page）
 * - 支持标签筛选（通过 searchParams.tag）
 * - 支持搜索（通过 searchParams.q）
 *
 * Next.js 16 中 searchParams 是 Promise，需要用 async/await 解析
 */
import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/data/articles";
import { ArticleList } from "@/components/articles/article-list";
import { Pagination } from "@/components/articles/pagination";
import { Calendar, Tag as TagIcon } from "lucide-react";

/**
 * 首页元数据
 */
export const metadata: Metadata = {
  title: "首页",
  description: "Gra 的个人博客首页 - 最新技术文章和随笔",
};

/**
 * 每页文章数量
 */
const PAGE_SIZE = 5;

/**
 * 首页组件（async 函数以处理 Promise searchParams）
 * Next.js App Router 的 Server Component 支持 async
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 等待 searchParams Promise 解析（Next.js 16 新特性）
  const resolved = await searchParams;

  // 提取单个值（如果是数组取第一个）
  const get = (key: string): string | undefined => {
    const v = resolved[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const page = Math.max(1, parseInt(get("page") || "1", 10));
  const tag = get("tag");
  const query = get("q")?.trim().toLowerCase();

  // 获取全部文章
  let allArticles = getAllArticles();

  // 标签筛选
  if (tag) {
    allArticles = allArticles.filter((a) => a.tags.includes(tag));
  }

  // 搜索筛选
  if (query) {
    allArticles = allArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  // 分页计算
  const total = allArticles.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedArticles = allArticles.slice(startIndex, startIndex + PAGE_SIZE);

  /**
   * 需要保留到分页链接的查询参数
   * 只传可序列化数据，避免向 Client Component 传函数
   */
  const paginationQuery = { tag, q: query };

  return (
    <div>
      {/* Hero 区域（仅在无筛选条件的首页第一页显示） */}
      {!tag && !query && currentPage === 1 && (
        <section className="mb-8 p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            欢迎来到 Gra 的博客 ✨
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
            这里分享技术学习心得、全栈项目实践和生活随笔。
            使用 Next.js SSR 构建，支持暗色主题和响应式阅读。
          </p>
        </section>
      )}

      {/* 当前筛选条件提示 */}
      {(tag || query) && (
        <div className="mb-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 flex-wrap">
            {tag && (
              <span className="flex items-center gap-1">
                <TagIcon className="w-4 h-4" />
                标签：<strong className="text-primary">{tag}</strong>
              </span>
            )}
            {query && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                搜索：<strong className="text-primary">"{query}"</strong>
              </span>
            )}
            <span>（共 {total} 篇）</span>
          </div>
          <Link href="/" className="text-primary hover:underline flex-shrink-0">
            清除筛选
          </Link>
        </div>
      )}

      {/* 文章列表 */}
      <ArticleList articles={pagedArticles} />

      {/* 分页 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/"
        query={paginationQuery}
      />
    </div>
  );
}
