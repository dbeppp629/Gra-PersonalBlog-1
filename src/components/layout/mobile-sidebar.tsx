/**
 * 移动端侧边栏抽屉组件
 * 从右侧滑入，包含完整的侧边栏内容
 */
"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { SiteSidebar } from "./site-sidebar";

/**
 * 移动端侧边栏抽屉
 * @param open 是否打开
 * @param onClose 关闭回调
 */
export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  // 打开时禁止 body 滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* 抽屉内容 */}
      <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-950 shadow-xl overflow-y-auto animate-slide-in">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <h2 className="font-semibold">导航菜单</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="关闭菜单"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <SiteSidebar />
        </div>
      </div>
    </div>
  );
}
