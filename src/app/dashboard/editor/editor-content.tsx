/**
 * 编辑器内容组件
 * Client Component：使用 useSearchParams 获取编辑参数
 * 注意：必须由父组件用 Suspense 包裹
 */
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { getAllArticles } from "@/lib/data/articles";

/**
 * 编辑器内容组件
 */
export function EditorContent() {
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("slug");

  // 根据 slug 查找要编辑的文章
  const articleToEdit = useMemo(() => {
    if (!editSlug) return null;
    return getAllArticles().find((a) => a.slug === editSlug) || null;
  }, [editSlug]);

  const [saved, setSaved] = useState(false);

  /**
   * 保存回调
   */
  const handleSave = (title: string, content: string) => {
    // 模拟保存（实际项目中应调用 API）
    console.log("保存文章：", { title, content });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回仪表盘
        </Link>
        <h1 className="text-xl font-bold">
          {articleToEdit ? "编辑文章" : "新建文章"}
        </h1>
        {saved && (
          <span className="text-sm text-green-600 dark:text-green-400">
            ✅ 已保存！
          </span>
        )}
      </div>

      {/* 编辑器 */}
      <RichTextEditor
        initialTitle={articleToEdit?.title || ""}
        initialContent={articleToEdit?.content || ""}
        onSave={handleSave}
      />

      {/* 底部提示 */}
      <p className="mt-4 text-xs text-gray-400 text-center">
        提示：图片使用 Base64 编码（演示用），生产环境建议上传到 CDN。视频支持 URL 嵌入（YouTube/Bilibili）和本地文件。语音输入需要浏览器支持。
      </p>
    </div>
  );
}
