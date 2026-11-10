/**
 * 站点侧边栏组件
 * - 搜索框
 * - 标签分类（云）
 * - 文章时间轴（最新发布）
 * 注意：这是一个 Server Component，数据直接从 mock 获取
 */
import Link from "next/link";
import { Search, Tag, Clock, ArrowRight } from "lucide-react";
import { mockTags, getAllArticles } from "@/lib/data/articles";
import { formatDate, groupArticlesByDate } from "@/lib/utils";

/**
 * 侧边栏组件
 */
export function SiteSidebar() {
  const articles = getAllArticles().slice(0, 10); // 取最新 10 篇
  const groupedByDate = groupArticlesByDate(articles);

  return (
    <div className="space-y-6 lg:sticky lg:top-20">
      {/* 搜索框 */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Link
          href="/search"
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">搜索文章...</span>
        </Link>
      </div>

      {/* 标签分类 */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h3 className="flex items-center gap-2 font-semibold mb-3">
          <Tag className="w-4 h-4 text-primary" />
          标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {mockTags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white transition-colors"
            >
              <span>{tag.name}</span>
              <span className="text-gray-400 group-hover:text-white/70">({tag.count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 文章时间轴 */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h3 className="flex items-center gap-2 font-semibold mb-4">
          <Clock className="w-4 h-4 text-primary" />
          最新发布
        </h3>
        <div className="relative">
          {/* 时间轴竖线 */}
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" />

          <div className="space-y-4">
            {Array.from(groupedByDate.entries()).map(([date, articlesOfDay]) => (
              <div key={date}>
                {/* 日期节点 */}
                <div className="relative flex items-center gap-2 mb-2">
                  <span className="w-4 h-4 rounded-full bg-primary border-2 border-white dark:border-gray-900 z-10" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(date)}</span>
                </div>

                {/* 当天的文章 */}
                <div className="pl-6 space-y-2">
                  {articlesOfDay.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/articles/${article.slug}`}
                      className="block text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors line-clamp-2"
                    >
                      {article.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-1 text-sm text-primary hover:underline mt-4 pt-4 border-t border-gray-200 dark:border-gray-800"
        >
          查看全部 <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 博主简介卡片 */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="font-semibold mb-2">关于博主</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          热爱技术与生活的全栈开发者，喜欢分享学习心得和项目实践。
        </p>
      </div>
    </div>
  );
}
