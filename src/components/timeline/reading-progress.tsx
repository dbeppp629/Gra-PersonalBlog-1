/**
 * 文章目录 + 阅读进度时间轴标注组件
 * Client Component：需要监听滚动位置来高亮当前章节
 * 实现：滚动时自动高亮当前阅读到的章节（用户需求："文章看到哪里时间轴就标注到哪里"）
 */
"use client";

import { useEffect, useState, useRef } from "react";
import { List, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 目录项类型
 */
interface Heading {
  level: number; // 2 或 3
  text: string;
  id: string;
}

/**
 * 文章目录 + 阅读进度组件
 * @param headings 从文章 HTML 解析出的标题列表
 */
export function ArticleTimeline({ headings }: { headings: Heading[] }) {
  // 当前活跃的目录项 ID
  const [activeId, setActiveId] = useState<string>("");
  // 整体阅读进度百分比
  const [progress, setProgress] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    // 为文章内容中的标题元素添加 ID（由于 dangerouslySetInnerHTML，这里通过 DOM 查找）
    const articleContent = document.querySelector(".article-content");
    if (!articleContent) return;

    const hElements = articleContent.querySelectorAll("h2, h3");
    const headingMap = new Map(headings.map((h) => [h.text, h.id]));

    hElements.forEach((el) => {
      const text = el.textContent?.trim() || "";
      const id = headingMap.get(text);
      if (id && !el.id) {
        el.id = id;
      }
    });

    // 使用 IntersectionObserver 检测当前可见的标题
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // 找到最顶部的可见标题
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top));

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    hElements.forEach((el) => observerRef.current!.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings]);

  // 计算整体阅读进度（基于页面滚动）
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setProgress(Math.round(pct));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (headings.length === 0) return null;

  /**
   * 点击目录项，平滑滚动到对应位置
   */
  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <div className="sticky top-20">
      {/* 阅读进度条 */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>阅读进度</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 目录标题 */}
      <h3 className="flex items-center gap-2 font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">
        <List className="w-4 h-4 text-primary" />
        文章目录
      </h3>

      {/* 目录列表 */}
      <nav className="relative">
        {/* 时间轴竖线 */}
        <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-gray-200 dark:bg-gray-700" />

        <ul className="space-y-1">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <li key={heading.id}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    "relative w-full text-left flex items-center gap-2 py-1.5 pr-2 transition-all text-xs lg:text-sm",
                    heading.level === 3 ? "pl-5" : "pl-3",
                    isActive
                      ? "text-primary font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                >
                  {/* 时间轴节点 - 当前位置有高亮 */}
                  <span
                    className={cn(
                      "absolute w-2.5 h-2.5 rounded-full border-2 transition-all",
                      heading.level === 3 ? "left-0" : "left-0",
                      isActive
                        ? "bg-primary border-white dark:border-gray-900 scale-125 shadow-md shadow-primary/50"
                        : "bg-gray-300 dark:bg-gray-600 border-white dark:border-gray-900"
                    )}
                  />
                  <ChevronRight
                    className={cn(
                      "w-3 h-3 flex-shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-gray-300 dark:text-gray-600"
                    )}
                  />
                  <span className="truncate">{heading.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
