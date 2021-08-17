# remark-bibliography

[![CI/CD Status](https://github.com/Symbitic/remark-plugins/workflows/main/badge.svg)](https://github.com/Symbitic/remark-plugins/actions)
[![MIT License](https://img.shields.io/github/license/Symbitic/remark-plugins)](https://github.com/Symbitic/remark-plugins/blob/master/LICENSE.md)
[![stars](https://img.shields.io/github/stars/Symbitic/remark-plugins.svg)](https://github.com/Symbitic/remark-plugins)

[Remark](https://remark.js.org/) plugin for adding citations and bibliographies to Markdown documents.

Bibliographies are included by specifying the `bibliography` field in the YAML frontmatter metadata
at the top of each document. Inline citations simply use @ followed by the name of the source.
A complete bibliography will then be appended to the bottom of the output. See the example below for more details.

This plugin requires [remark-meta](../remark-meta/README.md) to resolve the path to bibliography files.
Files are resolved relative to the path of the markdown file.

BibJSON is the only format currently supported, but support for other formats like BibTeX,
MODS, and RIS is planned. Pull requests are welcome.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm](https://docs.npmjs.com/cli/install):

```sh
npm install remark-bibliography
```

## Example

Consider the following example:
```
---
bibliography: example.json
locale: en-us
style: chicago
---

# Example Bibliography

Example citation:

Vulkan has better support for multithreading than OpenGL (@singh2016)

See the full reference for this citation below:
```

When given a bibliography file [example/example.json](example/example.json),
the result will look something like this: [examples/example.html](examples/example.html)

## Configuring

remark-bibliography is configured using several metadata fields in each document.

### `bibliography`

Required. Specifies the path to the bibliography file, relative to the current file.

### `locale`

Which locale the citations use. Supported options:
`de-de`, `en-gb`, `en-us`, `es-es`, and `fr-fr` (default: `en-us`).

### `style`

Which citation style to use for inline citations and the bibliography.
Supported options: `apa`, `chicago`, `mla`, and `vancouver` (default: `chicago`).

## Usage

```javascript
import { unified } from 'unified'
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

[MIT](LICENSE.md) © Alex Shaw
