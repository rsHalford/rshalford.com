import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: "https://www.rshalford.com",
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "rose-pine",
    },
  },
  integrations: [
    mdx({
      drafts: true,
    }),
    sitemap(),
    prefetch(),
    compress(),
  ],
});
