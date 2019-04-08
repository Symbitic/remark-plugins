# remark-bibliography

[Remark](https://remark.js.org/) plugin for adding citations and bibliographies to Markdown documents.

Currently only BibJSON and Chicago-style book citations are supported. More will be added soon.

This plugin requires `remark-meta`.

## Syntax

```markdown
---
bibliography: bibliography.json
---

# Title

Vulkan has better performance than OpenGL (@singh2016).
```

## Installation

```bash
npm install --save remark-bibliography
```

## Usage

```javascript
import unified from 'unified'
import markdown from 'remark-parse'
import html from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import bibliography from 'remark-bibliography'
import frontmatter from 'remark-frontmatter'
import meta from 'remark-meta'

unified()
  .use(markdown)
  .use(frontmatter)
  .use(meta)
  .use(bibliography)
  .use(remark2rehype)
  .use(html)
```

## License

[MIT](LICENSE.md) &copy; Alex Shaw
