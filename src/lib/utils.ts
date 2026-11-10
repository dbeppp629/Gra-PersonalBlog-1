/**
 * 通用工具函数
 * - 日期格式化
 * - 阅读时间估算
 * - classname 拼接（TailwindCSS 类名）
 */

import type { Article } from "./types";

/**
 * 格式化日期为人类可读格式
 * @param date ISO 日期字符串或 Date 对象
 * @returns 格式化后的日期字符串，如 "2025年11月9日"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 格式化相对时间（如 "3 天前"、"刚刚"）
 * @param date ISO 日期字符串或 Date 对象
 * @returns 相对时间字符串
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(diff / 2592000000);
  const years = Math.floor(diff / 31536000000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 30) return `${days} 天前`;
  if (months < 12) return `${months} 个月前`;
  return `${years} 年前`;
}

/**
 * 根据 HTML 内容估算阅读时间（分钟）
 * 按每分钟 200 中文字符估算
 * @param html HTML 内容字符串
 * @returns 阅读时间（分钟）
 */
export function estimateReadingTime(html: string): number {
  // 去除 HTML 标签，提取纯文本
  const text = html.replace(/<[^>]*>/g, "");
  const charCount = text.length;
  return Math.max(1, Math.ceil(charCount / 200));
}

/**
 * 拼接 TailwindCSS 类名，自动过滤 falsy 值
 * @param classes 可变参数，每个参数可以是字符串、数组或条件对象
 * @returns 拼接后的类名字符串
 */
export function cn(...classes: Array<string | false | undefined | null>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * 从 HTML 中截取摘要文本
 * @param html HTML 内容
 * @param maxLength 最大长度
 * @returns 纯文本摘要
 */
export function extractExcerpt(html: string, maxLength = 150): string {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * 生成简单的唯一 ID（用于评论等临时场景）
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 15);
}

/**
 * 将文章按日期分组（用于时间轴展示）
 * @param articles 文章列表
 * @returns 按日期分组的 Map，key 为 "YYYY-MM-DD"
 */
export function groupArticlesByDate(
  articles: Article[]
): Map<string, Article[]> {
  const groups = new Map<string, Article[]>();

  for (const article of articles) {
    const date = new Date(article.publishedAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(article);
  }

  return groups;
}
