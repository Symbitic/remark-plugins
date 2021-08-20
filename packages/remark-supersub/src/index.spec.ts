import supersub from './index';
import html from 'rehype-stringify'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import { unified } from 'unified'

const strip = ([str]: TemplateStringsArray) => str.replace(/\n {6}/g, '\n').replace(/\n {4}$/, '')

const parse = (str: string) =>
  unified()
    .use(markdown)
    .use(supersub)
    .use(remark2rehype)
    .use(html)
    .process(str)
    .then(data => data.toString())
;

const fixtures = [
  [
    'basic supersub list',
    strip`
      21^st^ Century

      H~2~O
    `
  ]
]

describe.each(fixtures)('remark-supersub', (name, source) => {
  it(`should parse a ${name}`, () => {
    return expect(parse(source)).resolves.toMatchSnapshot()
  })
})
