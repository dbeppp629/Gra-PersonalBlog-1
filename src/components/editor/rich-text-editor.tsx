/**
 * 富文本编辑器组件
 * 实现功能：
 * - 基本格式化：粗体、斜体、标题、列表、引用、代码块、链接
 * - 图片插入 + 尺寸调整
 * - 视频插入
 * - 语音输入（Web Speech API）
 * - AI 助手（润色/扩写/翻译）
 *
 * 使用 contentEditable 实现轻量级富文本编辑
 */
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Mic,
  MicOff,
  Wand2,
  Save,
  Eye,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 工具栏按钮类型
 */
interface ToolbarButton {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: string;
  shortcut?: string;
}

/**
 * 基础格式化按钮组
 */
const FORMAT_BUTTONS: ToolbarButton[] = [
  { icon: Bold, label: "粗体", action: "bold", shortcut: "Ctrl+B" },
  { icon: Italic, label: "斜体", action: "italic", shortcut: "Ctrl+I" },
  { icon: Underline, label: "下划线", action: "underline", shortcut: "Ctrl+U" },
];

const HEADING_BUTTONS: ToolbarButton[] = [
  { icon: Heading1, label: "标题 1", action: "h1" },
  { icon: Heading2, label: "标题 2", action: "h2" },
];

const BLOCK_BUTTONS: ToolbarButton[] = [
  { icon: List, label: "无序列表", action: "insertUnorderedList" },
  { icon: ListOrdered, label: "有序列表", action: "insertOrderedList" },
  { icon: Quote, label: "引用", action: "quote" },
  { icon: Code, label: "代码块", action: "codeBlock" },
];

/**
 * 富文本编辑器 Props
 */
interface RichTextEditorProps {
  /** 初始 HTML 内容 */
  initialContent?: string;
  /** 标题 */
  initialTitle?: string;
  /** 保存回调 */
  onSave?: (title: string, content: string) => void;
}

/**
 * 富文本编辑器组件
 */
export function RichTextEditor({
  initialContent = "",
  initialTitle = "",
  onSave,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(initialTitle);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 语音识别实例引用
  const recognitionRef = useRef<any>(null);

  // 检测语音 API 支持
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "zh-CN";

      // 识别结果回调
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // 将识别文本插入到光标位置
        if (finalTranscript) {
          insertTextAtCursor(finalTranscript);
        }
      };
    }
  }, []);

  /**
   * 在光标位置插入文本
   */
  const insertTextAtCursor = (text: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    // 创建文本节点，插入并移动光标
    const textNode = document.createTextNode(text + " ");
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    editorRef.current?.focus();
  };

  /**
   * 执行编辑命令
   */
  const execCommand = (action: string, value?: string) => {
    editorRef.current?.focus();

    switch (action) {
      case "h1":
        document.execCommand("formatBlock", false, "h1");
        break;
      case "h2":
        document.execCommand("formatBlock", false, "h2");
        break;
      case "quote":
        document.execCommand("formatBlock", false, "blockquote");
        break;
      case "codeBlock":
        document.execCommand("formatBlock", false, "pre");
        break;
      case "createLink": {
        const url = prompt("输入链接地址：");
        if (url) document.execCommand("createLink", false, url);
        break;
      }
      default:
        document.execCommand(action, false, value);
    }
  };

  /**
   * 切换语音录制
   */
  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) return;

    if (isVoiceRecording) {
      recognitionRef.current.stop();
      setIsVoiceRecording(false);
    } else {
      recognitionRef.current.start();
      setIsVoiceRecording(true);
    }
  };

  /**
   * 插入图片
   * 支持本地文件上传（演示用 FileReader Base64 编码）
   */
  const handleInsertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      for (const file of Array.from(files)) {
        // 使用 FileReader 读取为 Base64（演示用）
        // 生产环境应该上传到服务器/CDN 后获取 URL
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            // 插入图片 HTML
            execCommand("insertHTML", `<img src="${result}" alt="${file.name}" class="max-w-full rounded-lg my-4" />`);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  /**
   * 插入视频
   * 支持：URL (YouTube/Bilibili 嵌入) 或本地文件
   */
  const handleInsertVideo = () => {
    const choice = prompt('选择视频来源：\n1. 输入视频 URL（支持 YouTube/Bilibili）\n2. 输入 "local" 本地上传');

    if (!choice) return;

    if (choice === "local") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "video/*";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const url = URL.createObjectURL(file);
          execCommand(
            "insertHTML",
            `<video controls class="max-w-full rounded-lg my-4"><source src="${url}" type="${file.type}">您的浏览器不支持视频播放。</video>`
          );
        }
      };
      input.click();
    } else {
      // URL 嵌入处理
      let embedUrl = choice.trim();

      // Bilibili 视频链接转嵌入链接
      const biliMatch = embedUrl.match(/bilibili\.com\/video\/(BV\w+)/);
      if (biliMatch) {
        embedUrl = `//player.bilibili.com/player.html?bvid=${biliMatch[1]}&high_quality=1`;
      }

      // YouTube 链接转嵌入链接
      const ytMatch = embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)(\w+)/);
      if (ytMatch) {
        embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
      }

      execCommand(
        "insertHTML",
        `<div class="my-4 rounded-lg overflow-hidden aspect-video bg-black"><iframe src="${embedUrl}" class="w-full h-full" frameborder="0" allowfullscreen></iframe></div>`
      );
    }
  };

  /**
   * 保存文章
   */
  const handleSave = async () => {
    if (!title.trim() || !editorRef.current) return;

    setIsSaving(true);
    const content = editorRef.current.innerHTML;

    // 模拟保存延迟
    await new Promise((r) => setTimeout(r, 500));

    onSave?.(title, content);
    setIsSaving(false);
  };

  /**
   * AI 辅助按钮回调
   * 子组件 AI 助手通过此回调更新内容
   */
  const handleAIAction = async (action: string, text: string): Promise<string> => {
    // 这里是 Mock AI 实现，返回模拟结果
    await new Promise((r) => setTimeout(r, 800));

    const responses: Record<string, (t: string) => string> = {
      polish: (t) => `（AI 润色版）${t.replace(/。/g, "。").replace(/，/g, "，")}——这段经过了 AI 的语言优化，表达更加流畅自然。`,
      expand: (t) => `\n\n${t}\n\n从更深层次来看，这一观点值得我们进一步探讨。首先，我们需要理解问题的本质所在。其次，考虑到实际应用场景，这个方案具有良好的可行性。最后，通过持续的实践和迭代，相信能够取得更好的效果。`,
      translate: (t) => `\n\n**English Version:**\n\n${t}\n\n*(AI Translation - 这是 AI 翻译的示例输出)*`,
    };

    const result = responses[action]?.(text) || text;

    // 插入到编辑器
    editorRef.current?.focus();
    insertTextAtCursor(result);

    return result;
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
      {/* 标题输入 */}
      <input
        type="text"
        placeholder="输入文章标题..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-5 py-4 text-xl font-bold bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 outline-none"
      />

      {/* 工具栏 */}
      {!isPreview && (
        <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          {/* 基础格式 */}
          {FORMAT_BUTTONS.map((btn) => (
            <ToolbarBtn key={btn.action} btn={btn} onClick={() => execCommand(btn.action)} />
          ))}

          <Divider />

          {/* 标题 */}
          {HEADING_BUTTONS.map((btn) => (
            <ToolbarBtn key={btn.action} btn={btn} onClick={() => execCommand(btn.action)} />
          ))}

          <Divider />

          {/* 块级元素 */}
          {BLOCK_BUTTONS.map((btn) => (
            <ToolbarBtn key={btn.action} btn={btn} onClick={() => execCommand(btn.action)} />
          ))}

          <ToolbarBtn
            btn={{ icon: LinkIcon, label: "链接", action: "createLink" }}
            onClick={() => execCommand("createLink")}
          />

          <Divider />

          {/* 媒体插入 */}
          <ToolbarBtn
            btn={{ icon: ImageIcon, label: "插入图片", action: "image" }}
            onClick={handleInsertImage}
          />
          <ToolbarBtn
            btn={{ icon: Video, label: "插入视频", action: "video" }}
            onClick={handleInsertVideo}
          />

          <Divider />

          {/* 语音输入 */}
          {voiceSupported && (
            <button
              onClick={toggleVoiceRecording}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors",
                isVoiceRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
              title={isVoiceRecording ? "停止语音输入" : "开始语音输入"}
            >
              {isVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span className="hidden sm:inline text-xs">
                {isVoiceRecording ? "录音中..." : "语音输入"}
              </span>
            </button>
          )}

          <Divider />

          {/* 撤销/重做 */}
          <ToolbarBtn btn={{ icon: Undo, label: "撤销", action: "undo" }} onClick={() => execCommand("undo")} />
          <ToolbarBtn btn={{ icon: Redo, label: "重做", action: "redo" }} onClick={() => execCommand("redo")} />

          {/* 右侧操作区 */}
          <div className="ml-auto flex items-center gap-2">
            {/* AI 助手按钮 */}
            <button
              onClick={() => setIsAIOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm hover:opacity-90 transition-opacity"
            >
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">AI 助手</span>
            </button>

            {/* 预览切换 */}
            <button
              onClick={() => setIsPreview(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">预览</span>
            </button>

            {/* 保存按钮 */}
            <button
              onClick={handleSave}
              disabled={isSaving || !title.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-white text-sm hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "保存中..." : "保存"}</span>
            </button>
          </div>
        </div>
      )}

      {/* AI 助手面板 */}
      {isAIOpen && !isPreview && (
        <AIAssistantPanel
          onClose={() => setIsAIOpen(false)}
          onAction={handleAIAction}
          getSelectedText={() => window.getSelection()?.toString() || ""}
        />
      )}

      {/* 编辑器主区域 */}
      {isPreview ? (
        // 预览模式
        <div className="relative">
          <div
            className="article-content p-6 max-w-none"
            dangerouslySetInnerHTML={{
              __html: editorRef.current?.innerHTML || "",
            }}
          />
          <button
            onClick={() => setIsPreview(false)}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm hover:bg-primary-dark transition-colors"
          >
            继续编辑
          </button>
        </div>
      ) : (
        // 编辑模式
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="prose-like min-h-[400px] max-h-[600px] overflow-y-auto p-6 focus:outline-none text-gray-900 dark:text-gray-100"
          dangerouslySetInnerHTML={{ __html: initialContent }}
          data-placeholder="开始写点什么...（使用工具栏格式化，或点击麦克风语音输入）"
        />
      )}

      {/* CSS for contentEditable placeholder */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] h1 { font-size: 1.875rem; font-weight: bold; margin: 1rem 0 0.5rem; }
        [contenteditable] h2 { font-size: 1.5rem; font-weight: bold; margin: 1rem 0 0.5rem; border-bottom: 1px solid; padding-bottom: 0.25rem; }
        [contenteditable] blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; margin: 0.5rem 0; color: #6b7280; font-style: italic; }
        [contenteditable] pre { background: #111827; color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 0.5rem 0; font-size: 0.875rem; }
        [contenteditable] ul { list-style: disc; padding-left: 1.5rem; }
        [contenteditable] ol { list-style: decimal; padding-left: 1.5rem; }
        [contenteditable] a { color: #3b82f6; text-decoration: underline; }
        [contenteditable] p { margin: 0.5rem 0; }
        [contenteditable] img { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
        [contenteditable] video { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
      `}</style>
    </div>
  );
}

/**
 * 工具栏按钮子组件
 */
function ToolbarBtn({
  btn,
  onClick,
}: {
  btn: ToolbarButton;
  onClick: () => void;
}) {
  const Icon = btn.icon;
  return (
    <button
      onClick={onClick}
      title={`${btn.label}${btn.shortcut ? ` (${btn.shortcut})` : ""}`}
      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

/**
 * 分隔线子组件
 */
function Divider() {
  return <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />;
}

/**
 * AI 助手面板子组件
 */
function AIAssistantPanel({
  onClose,
  onAction,
  getSelectedText,
}: {
  onClose: () => void;
  onAction: (action: string, text: string) => Promise<string>;
  getSelectedText: () => string;
}) {
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState("");
  const [status, setStatus] = useState("");

  const actions = [
    { key: "polish", label: "✨ 润色", desc: "改进语言表达，使文章更流畅" },
    { key: "expand", label: "📝 扩写", desc: "对选中内容进行展开补充" },
    { key: "translate", label: "🌐 翻译", desc: "将中文翻译成英文" },
  ];

  const handleAIAction = async (key: string) => {
    const selected = getSelectedText();
    if (!selected) {
      alert("请先在编辑器中选中要处理的文字");
      return;
    }

    setLoading(true);
    setActionType(key);
    setStatus("AI 正在思考...");

    try {
      await onAction(key, selected);
      setStatus("✅ 已完成，结果已插入编辑器");
      setTimeout(() => {
        setStatus("");
        setActionType("");
      }, 2000);
    } catch {
      setStatus("❌ 处理失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-purple-500" />
          AI 文章助手
        </h4>
        <button
          onClick={onClose}
          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          关闭
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        在编辑器中选中一段文字，然后点击下方按钮让 AI 帮你处理
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => handleAIAction(action.key)}
            disabled={loading}
            className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-left hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="font-medium text-sm">{action.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {action.desc}
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <p className="mt-3 text-sm text-primary">{status}</p>
      )}
      {!loading && status && actionType && (
        <p className="mt-3 text-sm text-green-600 dark:text-green-400">{status}</p>
      )}
    </div>
  );
}
