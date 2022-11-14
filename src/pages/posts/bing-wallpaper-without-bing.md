---
layout: ../../layouts/PostLayout.astro
title: "Bing Wallpaper: Without Bing"
pubDate: "2021-08-18"
description: "Learn what it takes to write a shell script that downloads the latest Bing Wallpaper.  Using the core *nix command-line utilities, such as; grep, cut, echo and mkdir, along with the curl."
author: "richard"
image:
  url: "https://i.imgur.com/q2On1px.png"
  alt: "A Bing daily wallpaper being used as the background image for a browser start page."
tags: ["api", "cli", "linux", "script"]
---
Whilst Microsoft's Bing might not be many people's first choice of search engine. It has always had one thing going for it: daily homepage wallpapers.

But what about if you don't want to use Bing just for their wallpaper's? Because if we're honest with ourselves, that's an odd reason to stick with a search engine. Let alone decide to make it your browser's homepage.

Or maybe, like me, you're just too lazy and unimaginative to curate your own wallpaper collection. Don't want to keep storage of all those photos. And like the small spice in life that comes from not knowing what's today's wallpaper?

![Example use of Bing wallpaper as custom browser homepage background](https://i.imgur.com/IVOVfSb.png)
> The reason I wanted to find a way of getting these wallpapers, was to create my own simple browser homepage.

Either way, keep reading on as I'll be going through a small script that will find and download the latest Bing daily wallpaper. Then you can do whatever you'd like with it. And hopefully, you'll learn a bit more about some of the cool things you can achieve from shell scripting!

---

## The script

```sh
#!/bin/sh

bing="http://www.bing.com"
xmlURL="http://www.bing.com/HPImageArchive.aspx?format=xml&idx=0&n=1&mkt=en-WW"

saveDir=$XDG_CACHE_HOME'/bing-wp/'
mkdir -p $saveDir
picName="bing.jpg"

picURL=$bing$(echo $(curl -s $xmlURL) | grep -oP "<url>(.*)</url>" | cut -d | ">" -f 2 | cut -d "<" -f 1)

curl -s -o $saveDir$picName $picURL

exit
```

> Requirements: [curl](https://curl.se/download.html)

---

## Breaking it down

This **_shebang_** simply tell the parent shell which interpreter to use when running the script.

```sh
#!/bin/sh
```

> Tells the interpreter to use your system's shell. Typically this will be either *dash* or *bash*.

<br>

Here we're setting the variables to be used for creating the URL of the latest Bing wallpaper.

```sh
bing="http://www.bing.com"
xmlURL="http://www.bing.com/HPImageArchive.aspx?format=xml&idx=0&n=1&mkt=en-WW"
```

<br>

Then we define the location where the image will be saved to, once downloaded. By using the `mkdir` utility, to create the folder at the location defined as `$saveDir`. The `-p` option flag here, is used to make sure all the necessary parent directories up the branch of `bing-wp/` are also created. And finally, the variable `picName` is assigned to create the image file.

```sh
saveDir=$XDG_CACHE_HOME'/bing-wp/'
mkdir -p $saveDir
picName="bing.jpg"
```

> As every time this script is ran, it will write over the current image. `$XDG_CACHE_HOME` is used to denote the appropriate location for a temporary file, using the [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html). It merely represents in most *nix systems, the `~/.cache/` directory.

<br>

We can break down this nested and piped variable assignment into more understandable parts.

```sh
picURL=$bing$(echo $(curl -s $xmlURL) | grep -oP "<url>(.*)</url>" | cut -d ">" -f 2 | cut -d "<" -f 1)
```

<br>

Like before, this is simply reassigning Bing's base URL to a variable.

```sh
picURL=$bing
# picURL=http://www.bing.com
```

<br>

The `curl` command silently, `-s` - meaning without progress or error reporting - goes to the URL address assigned as `xmlURL`, and outputs it's contents.

```sh
$(curl -s $xmlURL)
# <?xml version="1.0" encoding="utf-8" ?><images><image><startdate>20210817</startdate><fullstartdate>202108170000</fullstartdate><enddate>20210818</enddate><url>/th?id=OHR.PochuckValley_ROW7250263541_1920x1080.jpg&amp;rf=LaDigue_1920x1080.jpg&amp;pid=hp</url><urlBase>/th?id=OHR.PochuckValley_ROW7250263541</urlBase><copyright>Stairway to Heaven trail, Wawayanda State Park, New Jersey, USA (© Leembe/Getty Images)</copyright><copyrightlink>https://www.bing.com/search?q=wawayanda+state+park+new+jersey&amp;form=hpcapt</copyrightlink><headline>Info</headline><drk>1</drk><top>1</top><bot>1</bot><hotspots></hotspots></image><tooltips><loadMessage><message>Loading...</message></loadMessage><previousImage><text>Previous image</text></previousImage><nextImage><text>Next image</text></nextImage><play><text>Play video</text></play><pause><text>Pause video</text></pause></tooltips></images>
```

> As an example, this is what that resulting XML looks like, as of writing this article. We'll use it as an example to explain the rest of the script.

<br>

Within this long line of XML are the `<url>` and `</url>` tags. Containing the day's Bing wallpaper URL parameters within. To separate this information from the `curl` commands output. We need to pipe that resulting string into `grep`.

```sh
grep -oP "<url>(.*)</url>"
# <url>/th?id=OHR.PochuckValley_ROW7250263541_1920x1080.jpg&amp;rf=LaDigue_1920x1080.jpg&amp;pid=hp</url>
```

> Using the `-P` flag to perform the pattern matching with Perl-compatible regular expressions. Combined with the `-o` option to only return the matching pattern, and not just highlight it.

> `(.*)` just creates a capturing group of everything between the tags.

<br>

Now we just need to remove the `<url>` and `</url>` tags surrounding the resource name and parameters of the image address. This will be done by piping this text through the `cut` command, twice.

```sh
cut -d ">" -f 2
# /th?id=OHR.PochuckValley_ROW7250263541_1920x1080.jpg&amp;rf=LaDigue_1920x1080.jpg&amp;pid=hp</url
```

```sh
cut -d "<" -f 1
# /th?id=OHR.PochuckValley_ROW7250263541_1920x1080.jpg&amp;rf=LaDigue_1920x1080.jpg&amp;pid=hp
```

> Using the delimiters, `-d`, `">"` and `"<"` to separate the tags from the URL segment. And then selecting the delimiter separated fields, `-f`, to capture the URL.

<br>

This snippet of the image URL is then concatenated with the `$bing` variable using `echo`. 

```sh
picURL=$bing$(echo ...)

# picURL=http://www.bing.com/th?id=OHR.PochuckValley_ROW7250263541_1920x1080.jpg&amp;rf=LaDigue_1920x1080.jpg&amp;pid=hp
```

<br>

Finally, putting this altogether, we can call `curl` to silently `-s` get the image with `$picURL`, now pointing towards the day's image. And direct the output `-o` to the be saved as `bing.jpg`, inside the `$XDG_CACHE_HOME/bing-wp/` directory.

```sh
curl -s -o $saveDir$picName $picURL
```

> Remembering to `exit` the script at the bottom of the file.

---

## Options for Running the Script

I won't get into how to do it here, but just as a pointer on how you can now take this script to run and get the latest Bing wallpaper. Here are a few options on how you might want to go about running the script everyday.

1. .xinitrc
2. systemd Timer
3. CronJob

---

Hopefully, after reading this tutorial on how to get Bing's latest daily wallpaper, you have learnt something new about shell scripting along the way. Thanks for reading through to the end, and if you've got any questions, ask below!