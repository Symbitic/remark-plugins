# remark-supersub

[Remark](https://remark.js.org/) plugin for adding support for pandoc-style superscript and subscript syntax to Markdown.

Adds two new node types to [MDAST](https://github.com/syntax-tree/mdast): `superscript` and `subscript`.
When using [rehype](https://github.com/rehypejs/rehype), these will be stringified as `sup` and `sub` respectively.

## Syntax

```markdown
21^st^ Century

H~2~O
```

## AST

The example above will yield:

```javascript
{
  type: 'paragraph',
  children: [
    {
      type: 'text',
      value: '21'
    },
    {
      type: 'superscript',
      children: [{
        type: 'text',
        value: 'st'
      }]
    },
    {
      type: 'text',
      value: ' Century'
    }
  ]
}
...
{
  type: 'paragraph',
  children: [
    {
      type: 'text',
      value: 'H'
    },
    {
      type: 'subscript',
      children: [{
        type: 'text',
        value: '2'
      }]
    },
    {
      type: 'text',
      value: 'O'
    }
  ]
}
```

## Installation

```bash
npm install --save remark-supersub
```

## Usage

```javascript
import unified from 'unified'
import markdown from 'remark-parse'
import html from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import supersub from 'remark-supersub'

unified()
  .use(markdown)
  .use(supersub)
  .use(remark2rehype)
  .use(html)
```

## License

[MIT](LICENSE.md) &copy; Alex Shaw
