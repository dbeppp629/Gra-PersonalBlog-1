/**
 * 全局 TypeScript 类型定义
 * 涵盖博客文章、评论、评分、用户等核心数据模型
 */

/** 文章接口 */
export interface Article {
  /** 文章唯一标识 slug（用于 URL） */
  slug: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  excerpt: string;
  /** 文章正文（HTML 富文本） */
  content: string;
  /** 封面图 URL */
  coverImage?: string;
  /** 标签列表 */
  tags: string[];
  /** 作者信息 */
  author: Author;
  /** 发布时间（ISO 字符串） */
  publishedAt: string;
  /** 更新时间（ISO 字符串） */
  updatedAt?: string;
  /** 阅读时长（分钟） */
  readingTime: number;
  /** 浏览量 */
  views: number;
  /** 评论数 */
  commentCount: number;
  /** 平均评分（0-5） */
  rating: number;
  /** 评分人数 */
  ratingCount: number;
}

/** 作者接口 */
export interface Author {
  /** 作者名 */
  name: string;
  /** 头像 URL */
  avatar?: string;
  /** 个人简介 */
  bio?: string;
}

/** 评论接口 */
export interface Comment {
  /** 评论唯一 ID */
  id: string;
  /** 关联文章的 slug */
  articleSlug: string;
  /** 评论者昵称 */
  nickname: string;
  /** 评论者邮箱（可选，不公开显示） */
  email?: string;
  /** 评论内容 */
  content: string;
  /** 评论时间（ISO 字符串） */
  createdAt: string;
  /** 点赞数 */
  likes: number;
}

/** 评分接口 */
export interface Rating {
  /** 关联文章的 slug */
  articleSlug: string;
  /** 评分值（1-5） */
  value: number;
  /** 用户选择的 emoji 态度 */
  emoji?: string;
  /** 评分时间 */
  createdAt: string;
}

/** 标签接口 */
export interface Tag {
  /** 标签名 */
  name: string;
  /** 标签颜色（Tailwind 色值名） */
  color: string;
  /** 使用次数 */
  count: number;
}

/** 分页参数 */
export interface Pagination {
  /** 当前页码（从 1 开始） */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总条数 */
  total: number;
  /** 总页数 */
  totalPages: number;
}

/** 文章列表响应 */
export interface ArticleListResponse {
  articles: Article[];
  pagination: Pagination;
}

/** 用户角色（博主/游客） */
export type UserRole = "blogger" | "visitor";
