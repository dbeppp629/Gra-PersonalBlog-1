/**
 * 文章列表组件
 * 展示文章卡片网格列表，支持特色文章布局
 */
import type { Article } from "@/lib/types";
import { ArticleCard } from "./article-card";

/**
 * 文章列表组件
 * @param articles 文章数组
 */
export function ArticleList({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-5">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
