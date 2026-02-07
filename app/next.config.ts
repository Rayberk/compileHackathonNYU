import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    domains: ['supabase.com', 'mapbox.com'],
  },
};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["ar"], // Arabic for UAE regional support
  });
}

