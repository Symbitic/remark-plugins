# remark-meta

[![CI/CD Status](https://github.com/Symbitic/remark-plugins/workflows/main/badge.svg)](https://github.com/Symbitic/remark-plugins/actions)
[![MIT License](https://img.shields.io/github/license/Symbitic/remark-plugins)](https://github.com/Symbitic/remark-plugins/blob/master/LICENSE.md)
[![stars](https://img.shields.io/github/stars/Symbitic/remark-plugins.svg)](https://github.com/Symbitic/remark-plugins)

[Remark](https://remark.js.org/) plugin for making frontmatter metadata visible to other plugins.

This plugin requires `remark-frontmatter`. There are no visible changes to the output; this plugin is just to help other plugins by adding metadata to a VFile.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm](https://docs.npmjs.com/cli/install):

```sh
npm install remark-meta
```

## Usage

```javascript
import { unified } from 'unified'
import markdown from 'remark-parse'
import html from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import meta from 'remark-meta'

unified()
  .use(markdown)
  .use(meta)
  .use(remark2rehype)
  .use(html)
```

## License

[MIT](LICENSE.md) © Alex Shaw
