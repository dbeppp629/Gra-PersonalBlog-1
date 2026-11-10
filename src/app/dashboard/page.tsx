/**
 * 博主仪表盘页面
 * 博主本人视角：
 * - 顶部统计卡片
 * - 文章管理列表
 * - 游客视角预览入口
 *
 * 注意：这个页面包含交互按钮（返回上一页），所以是 Client Component
 */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, FileText, Eye, Calendar } from "lucide-react";
import { getAllArticles } from "@/lib/data/articles";
import { formatDate } from "@/lib/utils";

/**
 * 仪表盘统计卡片
 */
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * 仪表盘主页（Client Component）
 */
export default function DashboardPage() {
  const router = useRouter();
  const [articles, setArticles] = useState(getAllArticles());

  // 客户端异步加载（避免 SSG 时使用 Math.random 等不纯操作）
  useEffect(() => {
    setArticles(getAllArticles());
  }, []);

  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const totalComments = articles.reduce((sum, a) => sum + a.commentCount, 0);

  return (
    <div>
      {/* 顶部操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            博主仪表盘
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            欢迎回来，Gra！这里管理你的博客内容
          </p>
        </div>
        <Link
          href="/dashboard/editor"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          <FileText className="w-4 h-4" />
          新建文章
        </Link>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FileText}
          label="文章总数"
          value={articles.length}
          color="bg-blue-500"
        />
        <StatCard
          icon={Eye}
          label="总浏览量"
          value={totalViews.toLocaleString()}
          color="bg-green-500"
        />
        <StatCard
          icon={BarChart3}
          label="总评论数"
          value={totalComments}
          color="bg-purple-500"
        />
        <StatCard
          icon={Calendar}
          label="本月发布"
          value={
            articles.filter(
              (a) =>
                new Date(a.publishedAt).getMonth() === new Date().getMonth()
            ).length
          }
          color="bg-orange-500"
        />
      </div>

      {/* 两栏布局：左侧文章管理，右侧游客预览 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 文章管理列表 */}
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            我的文章
          </h2>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {articles.map((article) => (
              <div
                key={article.slug}
                className="py-3 flex items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="font-medium text-sm truncate hover:text-primary transition-colors"
                  >
                    {article.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatDate(article.publishedAt)}</span>
                    <span>·</span>
                    <span>{article.views} 浏览</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/dashboard/editor?slug=${article.slug}`}
                    className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white transition-colors"
                  >
                    编辑
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 游客视角预览 */}
        <div className="p-5 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            游客看到的首页
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            点击下方按钮可以预览访客看到的博客首页效果。
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
            打开游客首页预览
          </button>

          {/* 简化的卡片预览（展示游客视角） */}
          <div className="mt-6 p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-400 mb-2">预览（缩小视图）</p>
            <div className="space-y-2">
              {articles.slice(0, 3).map((a) => (
                <div
                  key={a.slug}
                  className="p-2 rounded border border-gray-100 dark:border-gray-800"
                >
                  <div className="text-xs font-medium truncate">{a.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {formatDate(a.publishedAt)} · {a.readingTime} 分钟
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
