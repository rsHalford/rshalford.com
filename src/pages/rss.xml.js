import rss from "@astrojs/rss";

export const get = () =>({
  title: "rshalford | Blog",
  description: "Latest articles published to rshalford.com, about all things software",
  site: "https://www.rshalford.com",
  items: import.meta.glob("./**/*.md"),
  cusomtData: `<language>en-gb</language>`,
});