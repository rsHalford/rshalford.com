import { defineConfig } from "astro/config";
import { remarkReadingTime } from "./src/scripts/remark-reading-time.mjs";
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
    extendDefaultPlugins: true,
    remarkPlugins: [remarkReadingTime],
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
