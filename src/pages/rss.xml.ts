import rss from "@astrojs/rss";

export const get = () => rss({
  title: "rshalford | Blog",
  description: "Latest articles published to rshalford.com, about all things software",
  site: "https://www.rshalford.com",
  items: import.meta.glob("./**/*.{md,mdx}"),
  cusomtData: `<language>en-gb</language>`,
});