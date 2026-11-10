/**
 * 文章编辑器页面
 * 博主专属页面，支持：
 * - 新建文章
 * - 编辑已有文章（通过 ?slug=xxx 进入编辑模式）
 * - 富文本编辑、图片/视频插入、语音输入、AI 辅助
 *
 * 使用 Suspense 包裹 useSearchParams（Next.js App Router 要求）
 */
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EditorContent } from "./editor-content";

/**
 * 加载中的 fallback
 */
function EditorLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500"
        >
          <ArrowLeft className="w-4 h-4" />
          返回仪表盘
        </Link>
        <h1 className="text-xl font-bold">加载中...</h1>
        <div />
      </div>
      <div className="h-[500px] rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    </div>
  );
}

/**
 * 编辑器页面根组件
 */
export default function EditorPage() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <EditorContent />
    </Suspense>
  );
}
