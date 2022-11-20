import { defineConfig } from "astro/config";
import { remarkReadingTime } from "./src/scripts/remark-reading-time.mjs";

import mdx from "@astrojs/mdx";

export default defineConfig({
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
  ],
});
