/**
 * 根布局组件
 * 这是一个 Server Component（App Router 默认所有组件都是 Server Component）
 * 负责：
 * 1. HTML 骨架和元数据
 * 2. 引入全局样式
 * 3. 包裹 ThemeProvider 以支持暗色主题
 * 4. 提供全局的 Header 和 Sidebar 布局
 */
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/app/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteSidebar } from "@/components/layout/site-sidebar";

/**
 * 站点元数据（SEO）
 */
export const metadata: Metadata = {
  title: {
    default: "Gra 的个人博客",
    template: "%s | Gra 的个人博客",
  },
  description:
    "一个分享前端技术、全栈实践和生活随笔的个人博客。使用 Next.js SSR 构建，支持暗色主题和响应式设计。",
  keywords: ["博客", "Next.js", "React", "TypeScript", "前端开发", "全栈"],
  authors: [{ name: "Gra" }],
  creator: "Gra",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://example.com",
    siteName: "Gra 的个人博客",
    title: "Gra 的个人博客",
    description: "分享技术与生活的个人博客",
  },
};

/**
 * 根布局组件
 * @param children 页面内容
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        {/* ThemeProvider 处理主题切换，suppressHydrationWarning 避免 SSR/CSR 不匹配 */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="min-h-screen flex flex-col">
            {/* 顶部导航栏 */}
            <SiteHeader />

            {/* 主内容区域：左侧文章 + 右侧侧边栏 */}
            <main className="flex-1 container mx-auto px-4 py-6 lg:py-10">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-10">
                {/* 文章内容区 */}
                <div className="min-w-0">{children}</div>

                {/* 侧边栏（桌面端固定在右侧） */}
                <aside className="hidden lg:block">
                  <SiteSidebar />
                </aside>
              </div>
            </main>

            {/* 移动端侧边栏按钮会在 Header 中提供抽屉式入口 */}

            {/* 页脚 */}
            <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>© {new Date().getFullYear()} Gra 的个人博客. Built with Next.js & TailwindCSS.</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
