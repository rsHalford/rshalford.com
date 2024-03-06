package main

import (
	"flag"
	"log"
	"log/slog"
	"net/http"
	"time"

	"github.com/a-h/templ"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/httplog/v2"

	"rshalford/rshalford.com/internal"
	"rshalford/rshalford.com/internal/templates"
	"rshalford/rshalford.com/internal/templates/layouts"
	md "rshalford/rshalford.com/internal/util/markdown"
)

var postsDir = "./posts"

func listPosts(dir string) ([]md.Post, error) {
	posts, err := md.ParseMarkdownDirectory(postsDir)
	if err != nil {
		return nil, err
	}

	return posts, nil
}

func filterDrafts(posts []md.Post) []md.Post {
	for i := 0; i < len(posts); i++ {
		if posts[i].Frontmatter.Draft {
			posts = append(posts[:i], posts[i+1:]...)
			i--
		}
	}
	return posts
}

func postHandler(w http.ResponseWriter, r *http.Request) {
	posts, err := listPosts(postsDir)
	if err != nil {
		log.Fatalf("Error parsing posts directory: %v", err)
	}

	posts = filterDrafts(posts)

	slug := chi.URLParam(r, "slug")

	for i := range posts {
		cur := posts[i]
		prev := posts[i].Next
		next := posts[i].Prev

		if cur.Frontmatter.Slug == slug && !cur.Frontmatter.Draft {
			templ.Handler(layouts.Post(cur, prev, next)).ServeHTTP(w, r)
		}
	}
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	posts, err := listPosts(postsDir)
	if err != nil {
		log.Fatalf("Error parsing posts directory: %v", err)
	}

	posts = filterDrafts(posts)

	templ.Handler(templates.Index(posts)).ServeHTTP(w, r)
}

func main() {
	var port = "3000"

	flag.StringVar(&port, "port", port, "port to listen on")
	flag.Parse()

	logger := httplog.NewLogger("logger", httplog.Options{
		LogLevel:       slog.LevelInfo, // set to slog.LevelInfo/Warn/Error in prod
		RequestHeaders: true,
		JSON:           false, // set to true in prod
		Concise:        true,
		Tags: map[string]string{
			"version": "v0.1",
			"env":     "dev", // prod, dev
		},
	})

	rt := chi.NewRouter()

	rt.Use(httplog.RequestLogger(logger))

	rt.Get("/", indexHandler)
	rt.Get("/posts/{slug}", postHandler)

	internal.Mount(rt)

	server := &http.Server{
		Addr:    "localhost:" + port,
		Handler: http.TimeoutHandler(rt, 30*time.Second, "request timed out"),
	}

	slog.Info("Starting server:", "address", server.Addr)
	log.Fatal(server.ListenAndServe())
}
