## Compile tailwind

If using the Node tailwindcss CLI tool, prefix the following command with `npx`.

```sh
tailwindcss -i internal/assets/css/tailwind.css -o internal/static/styles.css -w
```

TODO: Can the output be compressed?


## Images

TODO: Compress images from internal/assets/images to internal/static


## Hot Reloading

```sh
$ templ generate --watch --proxy="http://localhost:3000" --cmd="go run cmd/server/main.go --port=3000"
```

## TODO

- recipes database (recipes.rshalford.com)
- gemini text to image header

## Markdown to HTML Generator

- Directory of .md files
- Generator runs through each and parses the content (incl. frontmatter)
- Converting it to raw HTML string using yuin/goldmark
- Templ takes in HTML string and generates Go files.
