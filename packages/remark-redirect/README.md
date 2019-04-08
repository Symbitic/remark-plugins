# remark-redirect

[Remark](https://remark.js.org/) plugin for redirecting links to markdown files into the equivalent HTML files (e.g. `[Link](link.md)` into `[Link](link.html)`). Also changes to `README.md` into `index.html`.

## Installation

```bash
npm install --save remark-redirect
```

## Usage

```javascript
import unified from 'unified'
import markdown from 'remark-parse'
import html from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import redirect from 'remark-redirect'

unified()
  .use(markdown)
  .use(redirect)
  .use(remark2rehype)
  .use(html)
```

## License

[MIT](LICENSE.md) &copy; Alex Shaw
