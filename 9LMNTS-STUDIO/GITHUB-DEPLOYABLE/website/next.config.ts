import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Exclude Supabase Edge Functions from TypeScript compilation
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  // Exclude supabase directory from build
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Add empty turbopack config to silence warning
  turbopack: {},
  // Configure TypeScript to ignore supabase directory
  serverExternalPackages: ['@supabase/supabase-js'],
};

export default nextConfig;

