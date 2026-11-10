import type { NextConfig } from "next";

/**
 * Next.js 配置文件
 * - 启用 React 严格模式
 * - 配置图片远程域名
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
