package markdown

import (
	"bytes"
	"context"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"time"

	"github.com/a-h/templ"
	"github.com/gosimple/slug"
	ms "github.com/mitchellh/mapstructure"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark-meta"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)

type Post struct {
	Frontmatter Frontmatter
	Content     string
	Next        *Post
	Prev        *Post
}

type Frontmatter struct {
	Title       string    `mapstructure:"title"`
	Description string    `mapstructure:"description"`
	PubDate     time.Time `mapstructure:"pubDate"`
	Author      string    `mapstructure:"author"`
	Tags        []string  `mapstructure:"tags"`
	Draft       bool      `mapstructure:"draft"`
	Slug        string
}

type Posts []Post

func (p Posts) Prev(cur int) *Post {
	if cur-1 >= 0 {
		return &p[cur-1]
	}
	return nil
}

func (p Posts) Next(cur int) *Post {
	if cur+1 < len(p) {
		return &p[cur+1]
	}
	return nil
}

// Unsafe will prevent templ from escaping the HTML from the parsed Markdown.
func Unsafe(html string) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) (err error) {
		_, err = io.WriteString(w, html)
		return
	})
}

// parseMarkdownFile takes a Markdown file path and returns the body content
// and frontmatter.
func parseMarkdownFile(file string) (string, Frontmatter, error) {
	source, err := os.ReadFile(file)
	if err != nil {
		return "", Frontmatter{}, err
	}

	md := goldmark.New(
		goldmark.WithParserOptions(parser.WithAutoHeadingID()),
		goldmark.WithRendererOptions(
			html.WithHardWraps(),
			// html.WithUnsafe(),
		),
		goldmark.WithExtensions(
			extension.GFM,
			extension.Footnote,
			extension.Typographer,
			meta.Meta,
		),
	)

	var buf bytes.Buffer

	ctx := parser.NewContext()

	if err := md.Convert([]byte(source), &buf, parser.WithContext(ctx)); err != nil {
		return "", Frontmatter{}, err
	}

	content := buf.String()
	data := meta.Get(ctx)

	frontmatter, err := decodeFrontmatter(data)
	if err != nil {
		return "", Frontmatter{}, err
	}

	frontmatter.Slug = slug.Make(frontmatter.Title)

	return content, frontmatter, nil
}

func decodeFrontmatter(data map[string]interface{}) (Frontmatter, error) {
	var frontmatter Frontmatter

	cfg := &ms.DecoderConfig{
		DecodeHook: ms.ComposeDecodeHookFunc(
			ms.StringToTimeHookFunc("2006-01-02"),
		),
		IgnoreUntaggedFields: true,
		Result:               &frontmatter,
	}

	decoder, err := ms.NewDecoder(cfg)
	if err != nil {
		return Frontmatter{}, err
	}

	if err = decoder.Decode(data); err != nil {
		return Frontmatter{}, err
	}

	return frontmatter, err
}

// ParseMarkdownDirectory walks through a given directory of Markdown files and
// performs the parseMarkdownFile function to get both fronmatter and body
// content.
func ParseMarkdownDirectory(dir string) (Posts, error) {
	var posts Posts

	err := filepath.Walk(dir, func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() && filepath.Ext(path) == ".md" {
			content, frontmatter, err := parseMarkdownFile(path)
			if err != nil {
				return err
			}

			post := Post{
				Frontmatter: frontmatter,
				Content:     content,
			}

			posts = append(posts, post)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	sort.Slice(posts, func(i, j int) bool {
		return posts[i].Frontmatter.PubDate.After(posts[j].Frontmatter.PubDate)
	})

	return posts, nil
}
