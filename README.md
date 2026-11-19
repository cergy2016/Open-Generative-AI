# Chung Studio

Desktop AI image and video studio for Chung Books: book covers, KDP images and social visuals.

- Tabs: Image and Video
- Presets for Kindle and paperback covers, Pinterest, square posts and banners (Image tab, aspect ratio menu)
- Generation runs through the Muapi.ai API. Add your API key in Settings.

## Build on Mac

```bash
npm install
npm run electron:build
```

The app is created in `release/`. If macOS blocks it, run:

```bash
xattr -cr "/Applications/Chung Studio.app"
```

## Credit and license

Chung Studio is a fork of [Open Generative AI](https://github.com/Anil-matcha/Open-Generative-AI) by Anil Matcha and contributors, released under the MIT License. The original copyright notice is kept in `LICENSE`.
