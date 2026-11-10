/**
 * Emoji 评分/态度表达组件
 * - 提供多种 emoji 供用户选择表达态度
 * - 同时支持 1-5 星评分
 * - Client Component：包含交互状态
 */
"use client";

import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 可选的态度 emoji 列表
 */
const EMOJI_OPTIONS = [
  { emoji: "👍", label: "赞" },
  { emoji: "❤️", label: "喜欢" },
  { emoji: "😂", label: "有趣" },
  { emoji: "🤔", label: "思考" },
  { emoji: "😢", label: "感动" },
  { emoji: "🔥", label: "精彩" },
];

/**
 * 评分组件 Props
 */
interface EmojiRateProps {
  /** 文章 slug */
  articleSlug: string;
  /** 当前平均评分 */
  initialRating: number;
  /** 评分人数 */
  initialCount: number;
}

/**
 * Emoji 评分 + 态度表达组件
 */
export function EmojiRate({ articleSlug, initialRating, initialCount }: EmojiRateProps) {
  // 用户选择的星级（1-5）
  const [userRating, setUserRating] = useState<number | null>(null);
  // 用户选择的 emoji
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  // 模拟的评分数据
  const [rating, setRating] = useState(initialRating);
  const [count, setCount] = useState(initialCount);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  /**
   * 提交评分
   */
  const handleRate = async (value: number) => {
    if (userRating !== null) return; // 已评过

    setUserRating(value);

    // 模拟提交
    await new Promise((r) => setTimeout(r, 300));

    // 更新平均评分
    const newCount = count + 1;
    const newAvg = (rating * count + value) / newCount;
    setRating(Math.round(newAvg * 10) / 10);
    setCount(newCount);
  };

  /**
   * 选择 emoji 态度
   */
  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(selectedEmoji === emoji ? null : emoji);
  };

  /**
   * 计算星星是否高亮
   */
  const isStarFilled = (star: number): boolean => {
    // 如果有悬浮态，优先显示悬浮态
    if (hoveredStar !== null) {
      return hoveredStar >= star;
    }
    // 如果用户已评分，显示用户评分
    if (userRating !== null) {
      return userRating >= star;
    }
    // 否则显示文章平均评分
    return rating >= star;
  };

  return (
    <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* 左侧：星评分 */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            给这篇文章打个分：
          </span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => handleRate(star)}
                disabled={userRating !== null}
                className={cn(
                  "p-0.5 transition-transform hover:scale-110 disabled:cursor-default",
                  userRating !== null && userRating !== star ? "opacity-50" : ""
                )}
                aria-label={`${star} 星`}
              >
                <Star
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isStarFilled(star)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300 dark:text-gray-600"
                  )}
                />
              </button>
            ))}
          </div>
          <span className="text-sm font-semibold text-primary">
            {rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({count} 人评价)
          </span>
        </div>

        {/* 右侧：Emoji 态度表达 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">表达你的感受：</span>
          <div className="flex gap-1.5">
            {EMOJI_OPTIONS.map(({ emoji, label }) => (
              <button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                title={label}
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-lg text-xl transition-all",
                  selectedEmoji === emoji
                    ? "bg-primary/20 scale-125"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110"
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 已评分提示 */}
      {userRating !== null && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" />
          感谢你的评分！你给了 {userRating} 星
        </div>
      )}
      {selectedEmoji && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          你选择了 {selectedEmoji} 来表达感受
        </div>
      )}
    </div>
  );
}
