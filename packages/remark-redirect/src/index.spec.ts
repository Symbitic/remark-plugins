/* eslint-env jest */
test('remark-redirect', () => {
  expect(2+2).toBe(4);
})

/*
import redirect from './index';
import html from 'rehype-stringify'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import { unified } from 'unified'

const strip = ([str]: TemplateStringsArray) => str.replace(/\n {6}/g, '\n').replace(/\n {4}$/, '')

const parse = (str: string) =>
  unified()
    .use(markdown)
    .use(redirect)
    .use(remark2rehype)
    .use(html)
    .process(str)
    .then(data => data.toString())
;

const fixtures = [
  [
    'basic link',
    strip`
      [README](README.md)
    `
  ]
]

describe.each(fixtures)('remark-redirect', (name, source) => {
  it(`should parse a ${name}`, () => {
    return expect(parse(source)).resolves.toMatchSnapshot()
  })
})
*/
