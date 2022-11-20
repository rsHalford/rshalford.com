import rss from "@astrojs/rss";

function sortPosts(a, b) {
  return (
    Number(new Date(b.frontmatter.pubDate)) -
    Number(new Date(a.frontmatter.pubDate))
  );
}

export const get = () => {
  const allPosts = Object.values(import.meta.globEager("./**/*.{md,mdx}"));
  const sortedPosts = allPosts.sort((a, b) => sortPosts(a, b));

  return rss({
    title: "Richard Halford's Blog",
    description:
      "Latest blog posts published to rshalford.com, mainly about software",
    site: "https://www.rshalford.com",
    items: sortedPosts.map((post) => ({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      pubDate: post.frontmatter.pubDate,
      link: post.url,
    })),
    cusomtData: `<language>en-gb</language>`,
    stylesheet: "/rss/style.xsl",
  });
};
