import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

function sortEntries(a, b) {
  return Number(new Date(b.data.pubDate)) - Number(new Date(a.data.pubDate));
}

export async function get() {
  const blogEntries = await getCollection("blog", ({ data }) => {
    return data.draft !== true;
  });
  const sortedEntries = blogEntries.sort((a, b) => sortEntries(a, b));

  return rss({
    title: "Richard Halford's Blog",
    description:
      "Latest blog posts published to rshalford.com, mainly about software",
    site: "https://www.rshalford.com",
    items: sortedEntries.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/${post.data.content}/${post.slug}/`,
    })),
    customData: `<language>en-gb</language>`,
    stylesheet: "/rss/style.xsl",
  });
}
