import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SERVER_URL_HTTP: process.env.NEXT_PUBLIC_SERVER_URL_HTTP,
    NEXT_PUBLIC_SERVER_URL_HTTPS: process.env.NEXT_PUBLIC_SERVER_URL_HTTPS,
    DEVMODE: (process.env.NEXT_PUBLIC_DEVMODE === 'development').toString(),
    TG_BOT: process.env.NEXT_PUBLIC_BOT_URL,
    VK: process.env.NEXT_PUBLIC_VK_URL,
    DISCORD: process.env.NEXT_PUBLIC_DISCORD_URL,
    TELEGRAM: process.env.NEXT_PUBLIC_TELEGRAM_URL,
    MODPACK_LINK: process.env.NEXT_PUBLIC_MODPACK_LINK
  }

};

module.exports = {
  reactStrictMode: false,
};

export default nextConfig;
