import test, { ExecutionContext } from 'ava';
import redirect from './index.js';
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

async function macro(t: ExecutionContext, input: any) {
  const result = await parse(input)
  t.snapshot(result)
}

macro.title = (name: string) => `remark-redirect should parse a ${name}`;

for (const fixture of fixtures) {
  const [ name, source ] = fixture
  test(name, macro, source);
}

/*
describe.each(fixtures)('remark-redirect', (name, source) => {
  it(`should parse a ${name}`, () => {
    return expect(parse(source)).resolves.toMatchSnapshot()
  })
})
*/
