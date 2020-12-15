# remark-deflist

[Remark](https://remark.js.org/) plugin for adding support for pandoc-style definition lists to Markdown.

Adds three new node types to [MDAST](https://github.com/syntax-tree/mdast): `descriptionlist`, `descriptionterm`, and `descriptiondetails`.
When using [rehype](https://github.com/rehypejs/rehype), these will be stringified as `dl`, `dt`, and `dd` respectively.

Mostly compatible with the [pandoc]/[PHP Markdown Extra] syntax. The only difference is that multi-paragraph descriptions are not currently supported.

## Example

### Syntax
```markdown
Term 1

: Definition 1
```

### AST

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

## Syntax

```
Term with *inline markup*

: Definition **1**
```

```
Lazy Initialization
: Achievement of compactness by not typing an extra line after the definition term.
```

```
Continuation

:   Splitting a single paragraph
    across multiple lines.
```

```
Lazy Continuation
: Ugliness
by not indenting text.
```

```
This is an example of multiple definitions for a single term.

Indent
: (*noun*) A whitespace to align text in a beautiful way.
: (*verb*) To add whitespace to make ugly code beautiful.
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

[pandoc]: https://pandoc.org/MANUAL.html#definition-lists
[PHP Markdown Extra]: https://michelf.ca/projects/php-markdown/extra/#def-list
