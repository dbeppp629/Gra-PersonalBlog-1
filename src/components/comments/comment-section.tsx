/**
 * 评论区组件
 * - 展示评论列表
 * - 提供评论表单（任何访客都可以评论）
 * - Client Component：包含表单交互逻辑
 */
"use client";

import { useState } from "react";
import { Send, MessageSquare, Heart } from "lucide-react";
import type { Comment } from "@/lib/types";
import { formatRelativeTime, generateId } from "@/lib/utils";

/**
 * 评论区组件 Props
 */
interface CommentSectionProps {
  /** 文章 slug */
  articleSlug: string;
  /** 初始评论列表（从 SSR 传入） */
  initialComments: Comment[];
}

/**
 * 评论区组件
 * 支持游客评论，无需登录
 */
export function CommentSection({ articleSlug, initialComments }: CommentSectionProps) {
  // 本地状态管理评论列表（包含用户刚提交的）
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /**
   * 提交评论
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim() || !content.trim()) return;

    setSubmitting(true);

    // 模拟 API 调用延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newComment: Comment = {
      id: generateId(),
      articleSlug,
      nickname: nickname.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setComments((prev) => [newComment, ...prev]);
    setContent("");
    setSubmitting(false);

    // 留言成功提示（可扩展 toast）
  };

  /**
   * 点赞评论
   */
  const handleLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      )
    );
  };

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="flex items-center gap-2 text-xl font-bold mb-6">
        <MessageSquare className="w-5 h-5 text-primary" />
        评论 ({comments.length})
      </h2>

      {/* 评论表单 */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="mb-3">
          <input
            type="text"
            placeholder="你的昵称"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="写下你的想法...（任何人都可以评论）"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm resize-none"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{content.length}/500</span>
          <button
            type="submit"
            disabled={submitting || !nickname.trim() || !content.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            {submitting ? "发送中..." : "发表评论"}
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            还没有评论，快来抢沙发吧！
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <div className="flex items-center gap-3 mb-2">
                {/* 头像（使用首字母） */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {comment.nickname.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{comment.nickname}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(comment.createdAt)}
                  </div>
                </div>
                {/* 点赞 */}
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                  {comment.likes}
                </button>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 pl-12 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
