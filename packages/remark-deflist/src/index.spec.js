/* eslint-env jest */
import deflist from './index'
import html from 'rehype-stringify'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import unified from 'unified'

const strip = ([str]) => str.replace(/\n +/g, '\n')

const parse = str =>
  unified()
    .use(markdown)
    .use(deflist)
    .use(remark2rehype)
    .use(html)
    .process(str)
    .then(data => data.toString())

const tests = [
  [
    'basic definition list',
    strip`
      Term 1

      : Definition 1
    `
  ],
  [
    'definition list with bold',
    strip`
      Term **1**

      : Definition **1**
    `
  ],[
    'definition list with multiple items',
    strip`
      Multiple definitions

      : Definition **1**
      : Definition 2
    `
  ],
  [
    'document with other elements',
    strip`
      Definition List

      : Definition 1

      This paragraph follows the definition list.
    `
  ],
  [
    'test for (#7)',
    strip`
      Term **1**
      : Definition **bold** 1
      : Definition 2
    `
  ]
]

describe.each(tests)('remark-deflist', (name, source) => {
  it(`should parse a ${name}`, () => {
    return expect(parse(source)).resolves.toMatchSnapshot()
  })
})
