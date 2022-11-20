import { defineConfig } from "astro/config";
import { remarkReadingTime } from "./src/scripts/remark-reading-time.mjs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify/functions";

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
  ],
  output: "server",
  adapter: netlify(),
});
