/**
 * Mock 博客数据
 * 提供文章列表、标签、评论等模拟数据
 * 在没有后端时用于前端开发演示
 */
import type { Article, Tag, Comment } from "@/lib/types";

/**
 * Mock 作者信息
 */
const mockAuthor = {
  name: "Gra",
  avatar: undefined,
  bio: "热爱技术与生活的全栈开发者，喜欢分享学习心得和项目实践。",
};

/**
 * Mock 标签数据
 */
export const mockTags: Tag[] = [
  { name: "Next.js", color: "bg-blue-500", count: 8 },
  { name: "React", color: "bg-cyan-500", count: 12 },
  { name: "TypeScript", color: "bg-indigo-500", count: 10 },
  { name: "TailwindCSS", color: "bg-teal-500", count: 6 },
  { name: "前端", color: "bg-purple-500", count: 15 },
  { name: "后端", color: "bg-green-500", count: 5 },
  { name: "全栈", color: "bg-orange-500", count: 7 },
  { name: "AI", color: "bg-pink-500", count: 4 },
  { name: "项目实战", color: "bg-red-500", count: 9 },
  { name: "随笔", color: "bg-gray-500", count: 3 },
];

/**
 * Mock 文章数据
 * 包含丰富的 HTML 内容、标签、阅读时间等
 */
export const mockArticles: Article[] = [
  {
    slug: "nextjs-ssr-deep-dive",
    title: "深入理解 Next.js SSR：从原理到实践",
    excerpt:
      "本文将带你深入 Next.js 的服务端渲染机制，对比 SSR、SSG、ISR 等渲染模式的差异，并通过实战案例理解何时选择哪种模式。",
    content: `
      <h2>什么是 SSR？</h2>
      <p>服务端渲染（Server-Side Rendering，SSR）是指在服务器端将组件渲染成 HTML 字符串，然后发送给客户端。相比传统的客户端渲染（CSR），SSR 能显著提升首屏加载速度和 SEO 表现。</p>
      
      <h2>Next.js 的渲染模式</h2>
      <p>Next.js 提供了多种渲染模式，让我们来逐一了解：</p>
      
      <h3>1. SSG（静态生成）</h3>
      <p>在构建时预渲染页面，生成静态 HTML 文件。适用于内容不经常变化的页面，如博客文章、文档等。</p>
      
      <h3>2. SSR（服务端渲染）</h3>
      <p>每次请求时在服务器端渲染页面。适用于需要实时数据或个性化内容的页面。</p>
      
      <h3>3. ISR（增量静态再生成）</h3>
      <p>结合了 SSG 和 SSR 的优点，在保持静态页面性能的同时支持定时更新内容。</p>
      
      <blockquote>
        <p>选择渲染模式的关键：考虑页面内容的更新频率、SEO 需求和用户个性化程度。</p>
      </blockquote>
      
      <h2>SSR 的性能优化</h2>
      <p>SSR 虽然能提升首屏速度，但也带来了服务端压力。以下是一些优化策略：</p>
      
      <ul>
        <li>使用缓存减少服务端计算</li>
        <li>将不依赖服务端数据的组件转为客户端组件</li>
        <li>利用 Next.js App Router 的 Server Components 特性</li>
        <li>合理使用流式渲染（Streaming）</li>
      </ul>
      
      <h2>实战示例</h2>
      <pre><code>// 这是一个 Server Component 示例
async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await fetchArticle(params.slug);
  return <ArticleContent article={article} />;
}</code></pre>
      
      <p>通过使用 Server Components，我们可以直接在组件中访问数据库或 API，而不需要额外的数据获取逻辑。</p>
    `,
    tags: ["Next.js", "React", "前端", "项目实战"],
    author: mockAuthor,
    publishedAt: "2026-11-08T10:00:00Z",
    updatedAt: "2026-11-08T12:30:00Z",
    readingTime: 8,
    views: 1256,
    commentCount: 3,
    rating: 4.8,
    ratingCount: 25,
  },
  {
    slug: "react-19-new-features",
    title: "React 19 新特性全面解析",
    excerpt:
      "React 19 带来了激动人心的更新：Server Components 正式稳定、Actions API、useOptimistic Hook 等，让我们看看这些特性如何改变开发体验。",
    content: `
      <h2>React 19 发布了什么？</h2>
      <p>React 19 是一次重要的版本更新，带来了多项改变开发范式的新特性。</p>
      
      <h2>Server Components 稳定版</h2>
      <p>Server Components 不再需要特殊的打包配置，可以直接在任何 React 环境中使用。这意味着组件可以在服务端执行，减少客户端 JavaScript 体积。</p>
      
      <h2>Actions API</h2>
      <p>新的 Actions API 让表单处理变得更加简单：</p>
      <pre><code>function UpdateName() {
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  
  const handleSubmit = (formData) => {
    startTransition(async () => {
      try {
        await updateName(formData.get('name'));
      } catch (e) {
        setError(e);
      }
    });
  };
  
  return <form action={handleSubmit}>...</form>;
}</code></pre>
      
      <h2>useOptimistic</h2>
      <p>useOptimistic Hook 让乐观更新变得前所未有的简单：</p>
      <pre><code>const [optimisticState, addOptimistic] = useOptimistic(
  state,
  (currentState, optimisticValue) => currentState + optimisticValue
);</code></pre>
      
      <h2>总结</h2>
      <p>React 19 代表了 React 的未来方向：更少的客户端代码、更好的服务端集成、更简单的异步处理。</p>
    `,
    tags: ["React", "前端"],
    author: mockAuthor,
    publishedAt: "2026-11-05T14:20:00Z",
    readingTime: 6,
    views: 2341,
    commentCount: 5,
    rating: 4.6,
    ratingCount: 42,
  },
  {
    slug: "tailwindcss-v4-migration",
    title: "迁移到 TailwindCSS v4：你需要知道的一切",
    excerpt:
      "TailwindCSS v4 带来了全新的配置方式和更大的性能提升。本文分享从 v3 迁移到 v4 的完整步骤和踩坑经验。",
    content: `
      <h2>v4 的核心变化</h2>
      <p>TailwindCSS v4 做了一次大胆的重构，主要变化包括：</p>
      
      <ul>
        <li>移除了 tailwind.config.js，改用 CSS 配置</li>
        <li>新的 @import "tailwindcss" 语法</li>
        <li>更快的构建速度（Rust 引擎）</li>
        <li>更好的设计变量支持</li>
      </ul>
      
      <h2>新的配置方式</h2>
      <p>在 v4 中，所有配置都在 CSS 中完成：</p>
      <pre><code>@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --font-family-sans: "Inter", sans-serif;
}

@custom-variant dark (&:where(.dark, .dark *));</code></pre>
      
      <h2>迁移清单</h2>
      <ol>
        <li>更新依赖到 v4</li>
        <li>替换 PostCSS 插件为 @tailwindcss/postcss</li>
        <li>将 tailwind.config.js 转换为 @theme CSS 块</li>
        <li>移除 @tailwind 指令，改用 @import</li>
        <li>测试所有自定义插件是否兼容</li>
      </ol>
      
      <h2>常见坑</h2>
      <p>迁移过程中遇到的主要问题是自定义插件兼容性和颜色配置方式的变化。建议先在小项目中试验。</p>
    `,
    tags: ["TailwindCSS", "前端", "项目实战"],
    author: mockAuthor,
    publishedAt: "2026-11-02T09:00:00Z",
    readingTime: 5,
    views: 876,
    commentCount: 2,
    rating: 4.5,
    ratingCount: 18,
  },
  {
    slug: "typescript-advanced-types",
    title: "TypeScript 高级类型：提升代码质量的利器",
    excerpt:
      "深入探讨 TypeScript 的条件类型、映射类型、模板字面量类型等高级特性，让你的类型定义更加强大和精确。",
    content: `
      <h2>为什么需要高级类型？</h2>
      <p>基础的类型系统能满足大部分场景，但当我们需要编写可复用的库或处理复杂的数据转换时，高级类型就变得必不可少。</p>
      
      <h2>条件类型</h2>
      <p>条件类型允许我们根据条件选择类型：</p>
      <pre><code>type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;  // true
type B = IsString<123>;     // false</code></pre>
      
      <h2>映射类型</h2>
      <p>映射类型可以基于已有类型创建新类型：</p>
      <pre><code>type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};</code></pre>
      
      <h2>模板字面量类型</h2>
      <p>TypeScript 4.1 引入的模板字面量类型非常强大：</p>
      <pre><code>type Greeting = \`Hello, \${string}!\`;

type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ClickEvent = EventName<"click">;  // "onClick"</code></pre>
      
      <h2>实战：类型安全的 API 层</h2>
      <p>通过高级类型，我们可以构建完全类型安全的 API 调用层，在编译时捕获参数错误。</p>
    `,
    tags: ["TypeScript", "前端"],
    author: mockAuthor,
    publishedAt: "2026-10-28T16:45:00Z",
    readingTime: 10,
    views: 1892,
    commentCount: 7,
    rating: 4.9,
    ratingCount: 56,
  },
  {
    slug: "fullstack-project-guide",
    title: "从零搭建全栈项目：技术选型与架构设计",
    excerpt:
      "一个完整的全栈项目需要考虑哪些方面？从技术选型到部署运维，本文分享一份详细的架构设计指南。",
    content: `
      <h2>项目规划</h2>
      <p>在开始编码之前，充分的规划可以避免后期大量重构。需要考虑的核心问题包括：</p>
      
      <ul>
        <li>项目规模和团队大小</li>
        <li>预期用户量和性能要求</li>
        <li>技术债务的承受能力</li>
        <li>未来的扩展方向</li>
      </ul>
      
      <h2>技术栈选择</h2>
      <p>对于现代全栈项目，我推荐以下组合：</p>
      
      <h3>前端</h3>
      <ul>
        <li>Next.js（App Router）作为全栈框架</li>
        <li>TypeScript 保证类型安全</li>
        <li>TailwindCSS 快速构建 UI</li>
      </ul>
      
      <h3>后端</h3>
      <ul>
        <li>可以用 Next.js API Routes 快速起步</li>
        <li>复杂场景推荐 NestJS 或 Express</li>
        <li>ORM 推荐 Prisma 或 Drizzle</li>
      </ul>
      
      <h3>基础设施</h3>
      <ul>
        <li>PostgreSQL 作为主数据库</li>
        <li>Redis 用于缓存和队列</li>
        <li>Docker + CI/CD 实现自动化部署</li>
      </ul>
      
      <h2>架构原则</h2>
      <p>无论选择什么技术栈，以下原则都值得遵循：</p>
      <ol>
        <li>关注点分离</li>
        <li>单一职责</li>
        <li>依赖注入</li>
        <li>接口抽象</li>
      </ol>
    `,
    tags: ["全栈", "后端", "项目实战"],
    author: mockAuthor,
    publishedAt: "2026-10-22T11:30:00Z",
    readingTime: 12,
    views: 3421,
    commentCount: 9,
    rating: 4.7,
    ratingCount: 73,
  },
  {
    slug: "ai-writing-assistant",
    title: "AI 写作助手实战：用 AI 提升博客创作效率",
    excerpt:
      "如何将 AI 集成到博客写作流程中？本文展示如何实现润色、扩写、翻译等 AI 辅助功能，并讨论使用边界。",
    content: `
      <h2>为什么需要 AI 助手？</h2>
      <p>写博客是一件需要持续投入的事情，但不是每个环节都需要从零开始。AI 可以在很多重复性工作上帮我们节省时间。</p>
      
      <h2>可以做什么？</h2>
      <ul>
        <li><strong>润色：</strong>改进语言表达，使文章更流畅</li>
        <li><strong>扩写：</strong>对已有段落进行展开，增加细节</li>
        <li><strong>翻译：</strong>快速将中文文章翻译成英文</li>
        <li><strong>大纲生成：</strong>根据主题建议文章结构</li>
        <li><strong>标题建议：</strong>生成多个备选标题供选择</li>
      </ul>
      
      <h2>实现思路</h2>
      <p>前端只需要提供交互界面，实际的 AI 调用应该在服务端完成，避免暴露 API Key：</p>
      <pre><code>// API Route 示例
export async function POST(req: Request) {
  const { text, action } = await req.json();
  const result = await callAI(text, action);
  return Response.json({ result });
}</code></pre>
      
      <h2>使用边界</h2>
      <blockquote>
        <p>AI 是工具而非替代品。最终输出必须经过人工审核，确保内容的准确性和个人风格。</p>
      </blockquote>
      
      <h2>隐私注意</h2>
      <p>发送给 AI 的内容可能涉及敏感信息，务必了解所用服务的数据处理政策。</p>
    `,
    tags: ["AI", "项目实战", "随笔"],
    author: mockAuthor,
    publishedAt: "2026-10-15T08:00:00Z",
    readingTime: 7,
    views: 1567,
    commentCount: 4,
    rating: 4.4,
    ratingCount: 29,
  },
  {
    slug: "responsive-design-patterns",
    title: "响应式设计模式：移动端优先的现代实践",
    excerpt:
      "移动端流量已经超过桌面端，响应式设计不再是可选项。本文总结实用的响应式设计模式和 TailwindCSS 实现技巧。",
    content: `
      <h2>移动优先策略</h2>
      <p>"移动优先"不仅仅是一种技术实现，更是一种设计思维。它要求我们先为最小屏幕设计，再逐步增强大屏幕体验。</p>
      
      <h2>常见的响应式模式</h2>
      
      <h3>1. 流动布局</h3>
      <p>使用百分比和 flexbox 让元素自动适应容器宽度。</p>
      
      <h3>2. 网格重排</h3>
      <p>在不同断点使用不同的 grid-template-columns。</p>
      <pre><code>/* TailwindCSS 方式 */
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  ...
</div></code></pre>
      
      <h3>3. 侧边栏折叠</h3>
      <p>小屏幕时侧边栏变成抽屉或底部导航。</p>
      
      <h3>4. 隐藏/显示</h3>
      <p>在特定屏幕尺寸显示或隐藏元素，但需谨慎使用，避免丢失重要信息。</p>
      
      <h2>性能考量</h2>
      <p>响应式设计不应以牺牲性能为代价：</p>
      <ul>
        <li>使用 responsive images 加载合适尺寸</li>
        <li>避免加载不必要的资源</li>
        <li>测试真实移动设备性能</li>
      </ul>
    `,
    tags: ["前端", "TailwindCSS"],
    author: mockAuthor,
    publishedAt: "2026-10-08T13:20:00Z",
    readingTime: 6,
    views: 934,
    commentCount: 1,
    rating: 4.3,
    ratingCount: 15,
  },
  {
    slug: "voice-input-web",
    title: "在 Web 应用中集成语音输入：技术方案与实践",
    excerpt:
      "语音输入能大幅提升移动端写作体验。本文介绍 Web Speech API 的使用方法，以及如何在博客编辑器中实现语音输入功能。",
    content: `
      <h2>Web Speech API 简介</h2>
      <p>Web Speech API 是浏览器提供的原生语音能力接口，包含两部分：</p>
      <ul>
        <li><strong>SpeechSynthesis：</strong>语音合成（TTS）</li>
        <li><strong>SpeechRecognition：</strong>语音识别（STT）</li>
      </ul>
      
      <h2>浏览器兼容性</h2>
      <p>目前 SpeechRecognition 主要在 Chrome 和 Edge 中支持良好，Firefox 和 Safari 支持有限。</p>
      
      <h2>基本用法</h2>
      <pre><code>// 创建识别实例
const recognition = new SpeechRecognition();
recognition.lang = 'zh-CN';
recognition.interimResults = true;

// 实时获取识别结果
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log(transcript);
};

recognition.start();</code></pre>
      
      <h2>实战：编辑器集成语音输入</h2>
      <p>在富文本编辑器中，语音输入需要考虑：</p>
      <ol>
        <li>实时更新光标位置的文本</li>
        <li>处理标点符号的自动添加</li>
        <li>语音与键盘输入的切换</li>
        <li>移动端权限请求和 UI 反馈</li>
      </ol>
      
      <h2>降级方案</h2>
      <p>对于不支持 Web Speech API 的浏览器，可以接入第三方服务如百度语音、讯飞等。</p>
    `,
    tags: ["前端", "项目实战"],
    author: mockAuthor,
    publishedAt: "2026-09-30T17:00:00Z",
    readingTime: 8,
    views: 1123,
    commentCount: 6,
    rating: 4.6,
    ratingCount: 34,
  },
  {
    slug: "image-video-optimization",
    title: "图片和视频的 Web 优化：加载更快、体验更好",
    excerpt:
      "媒体资源是网页性能的最大杀手。本文介绍现代 Web 图片/视频格式、自适应加载技术，以及在 Next.js 中的最佳实践。",
    content: `
      <h2>图片优化</h2>
      
      <h3>现代图片格式</h3>
      <ul>
        <li><strong>WebP：</strong>比 JPEG/PNG 小 25-35%</li>
        <li><strong>AVIF：</strong>新一代格式，压缩率更高</li>
        <li><strong>SVG：</strong>矢量图，无限缩放</li>
      </ul>
      
      <h3>响应式图片</h3>
      <p>使用 srcset 和 sizes 属性，为不同屏幕提供不同尺寸的图片：</p>
      <pre><code>&lt;img
  src="photo.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="描述"
/&gt;</code></pre>
      
      <h3>Next.js Image 组件</h3>
      <p>Next.js 的 Image 组件自动处理了以上所有优化：</p>
      <pre><code>import Image from 'next/image';

&lt;Image
  src="/photo.jpg"
  alt="描述"
  width={800}
  height={600}
  sizes="(max-width: 600px) 100vw, 50vw"
/&gt;</code></pre>
      
      <h2>视频优化</h2>
      
      <h3>视频格式选择</h3>
      <ul>
        <li><strong>MP4 (H.264)：</strong>兼容性最好</li>
        <li><strong>WebM：</strong>开源，体积更小</li>
        <li><strong>Streaming：</strong>HLS/DASH 自适应码率</li>
      </ul>
      
      <h3>加载策略</h3>
      <ul>
        <li>使用 preload="none" 避免预加载</li>
        <li>提供 poster 图片作为封面</li>
        <li>考虑懒加载和延迟播放</li>
      </ul>
    `,
    tags: ["前端", "项目实战"],
    author: mockAuthor,
    publishedAt: "2026-09-22T10:15:00Z",
    readingTime: 9,
    views: 756,
    commentCount: 2,
    rating: 4.5,
    ratingCount: 22,
  },
  {
    slug: "personal-blog-roadmap",
    title: "我的个人博客建设路线图",
    excerpt:
      "为什么要写博客？我的博客架构和技术选型是什么？未来有哪些规划？这是一篇关于博客本身的随笔。",
    content: `
      <h2>为什么写博客？</h2>
      <p>写博客对我来说有几个重要的意义：</p>
      <ul>
        <li><strong>知识沉淀：</strong>把学到的东西整理成文字，加深理解</li>
        <li><strong>分享交流：</strong>希望能帮到遇到同样问题的人</li>
        <li><strong>个人品牌：</strong>构建自己的技术名片</li>
        <li><strong>记录成长：</strong>回头看自己一年前写的东西，也是一种乐趣</li>
      </ul>
      
      <h2>技术架构</h2>
      <p>当前博客使用的技术栈：</p>
      <ul>
        <li>Next.js 16 + App Router</li>
        <li>TypeScript</li>
        <li>TailwindCSS v4</li>
        <li>Server Components + Client Components 混合</li>
        <li>AI 辅助写作（润色、扩写、翻译）</li>
      </ul>
      
      <h2>功能规划</h2>
      <h3>已有功能</h3>
      <ul>
        <li>文章列表和详情</li>
        <li>标签分类和搜索</li>
        <li>评论和评分</li>
        <li>暗色主题</li>
        <li>响应式设计</li>
      </ul>
      
      <h3>计划中</h3>
      <ul>
        <li>RSS 订阅</li>
        <li>邮件推送</li>
        <li>文章系列/合集</li>
        <li>阅读统计分析</li>
        <li>多语言支持</li>
      </ul>
      
      <h2>写在最后</h2>
      <p>博客是一个长期项目，不需要一开始就追求完美。先发布，再迭代，这是我的信条。</p>
      
      <p>如果你看到了这里，感谢你的阅读！欢迎留言交流。</p>
    `,
    tags: ["随笔", "全栈"],
    author: mockAuthor,
    publishedAt: "2026-09-15T20:00:00Z",
    readingTime: 5,
    views: 2345,
    commentCount: 12,
    rating: 4.8,
    ratingCount: 89,
  },
];

/**
 * Mock 评论数据（按文章 slug 分组）
 */
export const mockComments: Record<string, Comment[]> = {
  "nextjs-ssr-deep-dive": [
    {
      id: "c1",
      articleSlug: "nextjs-ssr-deep-dive",
      nickname: "小明",
      content: "写得很详细！我最近也在学习 Next.js SSR，这篇文章帮我理清了很多概念。",
      createdAt: "2026-11-08T14:00:00Z",
      likes: 5,
    },
    {
      id: "c2",
      articleSlug: "nextjs-ssr-deep-dive",
      nickname: "Alex",
      content: "Streaming 那部分可以再展开讲讲吗？感觉是个很强大的特性但文档不多。",
      createdAt: "2026-11-08T15:30:00Z",
      likes: 3,
    },
    {
      id: "c3",
      articleSlug: "nextjs-ssr-deep-dive",
      nickname: "路人甲",
      content: "Server Components 和 Client Components 的边界有时候真的搞不清楚，有什么判断技巧吗？",
      createdAt: "2026-11-09T09:00:00Z",
      likes: 2,
    },
  ],
  "react-19-new-features": [
    {
      id: "c4",
      articleSlug: "react-19-new-features",
      nickname: "前端老王",
      content: "useOptimistic 真的好用！以前写乐观更新要好多代码。",
      createdAt: "2026-11-05T16:00:00Z",
      likes: 8,
    },
    {
      id: "c5",
      articleSlug: "react-19-new-features",
      nickname: "新手上路",
      content: "Actions API 和传统的 form submit 有什么区别吗？",
      createdAt: "2026-11-06T10:00:00Z",
      likes: 1,
    },
  ],
};

/**
 * 模拟数据库查询：获取所有文章
 */
export function getAllArticles(): Article[] {
  return [...mockArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * 模拟数据库查询：获取单篇文章
 */
export function getArticleBySlug(slug: string): Article | undefined {
  return mockArticles.find((a) => a.slug === slug);
}

/**
 * 模拟数据库查询：获取评论
 */
export function getCommentsByArticle(slug: string): Comment[] {
  return mockComments[slug] || [];
}
