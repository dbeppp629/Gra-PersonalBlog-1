/**
 * 标签分类页面（SSR）
 * - 根据 URL 参数 tag 获取对应文章列表
 * - 支持分页
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tag as TagIcon, ArrowLeft } from "lucide-react";
import { getAllArticles, mockTags } from "@/lib/data/articles";
import { ArticleList } from "@/components/articles/article-list";

/**
 * 生成静态参数（所有标签）
 */
export function generateStaticParams() {
  return mockTags.map((tag) => ({
    tag: encodeURIComponent(tag.name),
  }));
}

/**
 * 标签页面元数据
 * Next.js 16 中 params 是 Promise，需要 await
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const tagName = decodeURIComponent(tag);
  return {
    title: `标签：${tagName}`,
    description: `所有带 "${tagName}" 标签的文章`,
  };
}

/**
 * 标签分类页面
 * Next.js 16 中 params 是 Promise，需要 await
 */
export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const tagName = decodeURIComponent(tag);

  // 获取该标签下的所有文章
  const articles = getAllArticles().filter((a) => a.tags.includes(tagName));

  // 如果没有任何文章带该标签，显示 404
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">标签 "{tagName}" 暂无文章</h1>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 返回链接 */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        返回文章列表
      </Link>

      {/* 标签头部 */}
      <header className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">
            <TagIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">#{tagName}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              共 {articles.length} 篇相关文章
            </p>
          </div>
        </div>
      </header>

      {/* 文章列表 */}
      <ArticleList articles={articles} />
    </div>
  );
}
