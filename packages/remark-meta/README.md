# remark-bibliography

[Remark](https://remark.js.org/) plugin for making frontmatter metadata visible to other plugins.

This plugin requires `remark-frontmatter`. There are no visible changes to the output; this plugin is just to help other plugins by adding metadata to a VFile.

## Installation

```bash
npm install --save remark-meta
```

## Usage

```javascript
import unified from 'unified'
import markdown from 'remark-parse'
import html from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import meta from 'remark-meta'
import frontmatter from 'remark-frontmatter'

unified()
  .use(markdown)
  .use(frontmatter)
  .use(meta)
  .use(remark2rehype)
  .use(html)
```

## License

[MIT](LICENSE.md) &copy; Alex Shaw
