import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Next가 잘못된 workspace root(예: 사용자 홈의 lockfile)로 추론하는 문제 방지
    root: path.join(__dirname),
  },
};

export default nextConfig;
