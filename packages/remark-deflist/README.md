# remark-deflist

[Remark](https://remark.js.org/) plugin for adding support for pandoc-style definition lists to Markdown.

Adds three new node types to [MDAST](https://github.com/syntax-tree/mdast): `descriptionlist`, `descriptionterm`, and `descriptiondetails`.
When using [rehype](https://github.com/rehypejs/rehype), these will be stringified as `dl`, `dt`, and `dd` respectively.

Multi-line definitions are not supported.

## Syntax

```markdown
Term 1

: Definition 1
```

## AST

The example above will yield:

```javascript
{
  type: 'descriptionlist',
  children: [
    {
      type: 'descriptionterm',
      children: [{
        type: 'text',
        value: 'Term 1'
      }]
    },
    {
      type: 'descriptiondetails',
      children: [{
        type: 'text',
        value: 'Definition 1'
      }]
    }
  ]
}
```

## Installation

```bash
npm install --save remark-deflist
```

## Usage

```javascript
import unified from 'unified'
import markdown from 'remark-parse'
import html from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import deflist from 'remark-deflist'

unified()
  .use(markdown)
  .use(deflist)
  .use(remark2rehype)
  .use(html)
```

## License

[MIT](LICENSE.md) &copy; Alex Shaw
