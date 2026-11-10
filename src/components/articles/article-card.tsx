/**
 * 文章卡片组件
 * 用于列表页展示单篇文章的摘要信息
 * 可在 SSR 或 CSR 中使用（纯展示组件）
 */
import Link from "next/link";
import { Calendar, Clock, Eye, MessageSquare, Star } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/**
 * 文章卡片组件
 * @param article 文章数据
 * @param featured 是否为特色文章（展示更大卡片样式）
 */
export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article
      className={`group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="p-5 lg:p-6">
          {/* 标签 */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary dark:bg-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 标题 */}
          <h2
            className={`font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 ${
              featured ? "text-xl lg:text-2xl" : "text-lg"
            }`}
          >
            {article.title}
          </h2>

          {/* 摘要 */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
            {article.excerpt}
          </p>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            {/* 发布时间 */}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(article.publishedAt)}
            </span>

            {/* 阅读时间 */}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTime} 分钟
            </span>

            {/* 浏览量 */}
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {article.views}
            </span>

            {/* 评论数 */}
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {article.commentCount}
            </span>

            {/* 评分 */}
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              {article.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
