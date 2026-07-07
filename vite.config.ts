import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

const PROJECT_ROOT = import.meta.dirname;

const analyticsPlugin = {
  name: "analytics-plugin",
  transformIndexHtml(html: string) {
    const endpoint = process.env.VITE_ANALYTICS_ENDPOINT;
    const websiteId = process.env.VITE_ANALYTICS_WEBSITE_ID;
    
    if (!endpoint || !websiteId || endpoint.includes("%") || websiteId.includes("%")) {
      return html.replace(/<script[^>]*src="%VITE_ANALYTICS_ENDPOINT%[\s\S]*?<\/script>/gi, "");
    }
    
    return html
      .replace(/%VITE_ANALYTICS_ENDPOINT%/g, endpoint)
      .replace(/%VITE_ANALYTICS_WEBSITE_ID%/g, websiteId);
  }
};

const plugins = [react(), tailwindcss(), jsxLocPlugin(), analyticsPlugin];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
