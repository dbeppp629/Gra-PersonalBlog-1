/**
 * 全局 404 页面
 * Next.js App Router 约定：app/not-found.tsx
 *
 * 包含 onClick 事件处理器，需要是 Client Component
 */
"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center">
        {/* 大号 404 */}
        <h1 className="text-8xl font-bold text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold mb-2">页面未找到</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          抱歉，你访问的页面不存在或已被移除。
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            <Home className="w-4 h-4" />
            返回首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回上一页
          </button>
        </div>
      </div>
    </div>
  );
}
