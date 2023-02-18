import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import image from "@astrojs/image";
import prefetch from "@astrojs/prefetch";
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: "https://www.rshalford.com",
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "rose-pine-moon",
    },
  },
  integrations: [
    mdx({
      drafts: true,
    }),
    sitemap(),
    image({
      logLevel: "warn",
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    prefetch(),
    compress(),
  ],
});
