/**
 * 顶部导航栏组件
 * Client Component：包含主题切换、移动端抽屉开关等客户端交互
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, Search, PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";

/**
 * 顶部导航栏
 * - Logo 和站点标题
 * - 主题切换按钮
 * - 移动端菜单按钮
 * - 博主入口（仪表盘）
 */
export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo 和标题 */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm">
              G
            </span>
            <span className="hidden sm:inline">Gra 的博客</span>
          </Link>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-2">
            {/* 快速搜索按钮（移动端友好） */}
            <Link
              href="/search"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="搜索"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* 主题切换按钮 */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="切换主题"
            >
              <Sun className={cn("w-5 h-5 transition-transform", theme === "dark" ? "hidden" : "block")} />
              <Moon className={cn("w-5 h-5 transition-transform", theme === "dark" ? "block" : "hidden")} />
            </button>

            {/* 博主入口 - 仪表盘链接（在实际项目中需要鉴权） */}
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm hover:bg-primary-dark transition-colors"
            >
              <PenSquare className="w-4 h-4" />
              <span>写文章</span>
            </Link>

            {/* 移动端侧边栏抽屉按钮 */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="打开菜单"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 移动端侧边栏抽屉 */}
      <MobileSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
