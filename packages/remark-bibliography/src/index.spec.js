/* eslint-env jest */
import bibliography from './index'
import html from 'rehype-stringify'
import markdown from 'remark-parse'
import path from 'path'
import remark2rehype from 'remark-rehype'
import unified from 'unified'

const ASSETS = path.resolve(__dirname, '..', 'examples')

const parse = (bib, str) =>
  unified()
    .use(markdown)
    .use(() => (tree, file) => {
      file.history = [ path.join(ASSETS, 'examples.md') ]
      file.data = { bibliography: bib }
    })
    .use(bibliography)
    .use(remark2rehype)
    .use(html)
    .process(str)
    .then(data => data.toString())

const EXAMPLE1 = `This is a citation: (@singh2016).`

const tests = [
  [ 'process a basic bibliography', 'example.json', EXAMPLE1 ]
]

describe.each(tests)('remark-bibliography', (desc, file, source) => {
  it(`should ${desc}`, () => {
    return expect(parse(file, source)).resolves.toMatchSnapshot()
  })
})
