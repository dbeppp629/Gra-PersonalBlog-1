/**
 * 文章详情页（SSR + Streaming）
 * - 服务端获取文章数据和评论
 * - 富文本内容渲染
 * - 侧边栏：目录导航 + 阅读进度时间轴标注
 * - 评论和评分组件
 * - 支持根据文章内容自动生成目录
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Eye, Tag, User } from "lucide-react";
import { getAllArticles, getArticleBySlug, getCommentsByArticle } from "@/lib/data/articles";
import { formatDate } from "@/lib/utils";
import { CommentSection } from "@/components/comments/comment-section";
import { EmojiRate } from "@/components/rating/emoji-rate";
import { ArticleTimeline } from "@/components/timeline/reading-progress";

/**
 * 生成静态参数（SSG）- 预渲染所有文章详情页
 */
export function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.slug,
  }));
}

/**
 * 动态元数据（每篇文章的 SEO）
 * Next.js 16 中 params 是 Promise，需要 await
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "文章未找到" };

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
    },
  };
}

/**
 * 解析 HTML 内容中的标题，生成目录结构
 * 为每个 h2/h3 添加 id 锚点（客户端会处理）
 */
function extractHeadings(html: string): Array<{ level: number; text: string; id: string }> {
  const headings: Array<{ level: number; text: string; id: string }> = [];
  const regex = /<h([23])[^>]*>([^<]+)<\/h\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-|-$/g, "");
    headings.push({ level, text, id });
  }

  return headings;
}

/**
 * 文章详情页
 * Next.js 16 中 params 是 Promise，需要 await
 */
export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  // 文章不存在时返回 404
  if (!article) {
    notFound();
  }

  const comments = getCommentsByArticle(slug);
  const headings = extractHeadings(article.content);

  return (
    <article>
      {/* 返回链接 */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        返回文章列表
      </Link>

      {/* 文章头部 */}
      <header className="mb-8">
        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </Link>
          ))}
        </div>

        {/* 标题 */}
        <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
          {article.title}
        </h1>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {article.author.name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {article.readingTime} 分钟阅读
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {article.views} 浏览
          </span>
        </div>

        {/* 摘要 */}
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          {article.excerpt}
        </p>
      </header>

      {/* 评分组件（文章头部即展示） */}
      <EmojiRate
        articleSlug={article.slug}
        initialRating={article.rating}
        initialCount={article.ratingCount}
      />

      {/* 文章正文区域（包含侧边栏目录） */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_200px] gap-8 mt-8">
        {/* 主内容 */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* 侧边目录（xl 以上屏幕显示） */}
        <aside className="hidden xl:block">
          <ArticleTimeline headings={headings} />
        </aside>
      </div>

      {/* 评论区 */}
      <CommentSection articleSlug={article.slug} initialComments={comments} />
    </article>
  );
}
