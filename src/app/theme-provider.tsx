/**
 * 主题提供者客户端组件
 * next-themes 的 ThemeProvider 必须是 Client Component
 * 用 'use client' 指令标记
 */
"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * 主题提供者包装组件
 * 将 next-themes 的 ThemeProvider 导出为独立组件
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
