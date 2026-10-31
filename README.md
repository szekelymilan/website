# szekelymilan.eu

Source of my personal website: **[szekelymilan.eu](https://szekelymilan.eu/)**

A single static page: plain HTML, CSS and a little JavaScript. The content works without JavaScript, as the script only adds effects (typed tagline, scroll reveal, background signal).

## Structure

```
public/
├── index.html            page content and metadata
├── style.css             styles
├── main.js               effects only
├── profile.jpg           profile photo, also the link-preview image
├── favicon.ico           icon fallback
├── favicon.svg           icon
├── apple-touch-icon.png  iOS home-screen icon
├── robots.txt
└── sitemap.xml
```

Everything served lives in `public/`.

## Run locally

```bash
python3 -m http.server -d public
```

Then open http://localhost:8000.

## License

[MIT](LICENSE)
