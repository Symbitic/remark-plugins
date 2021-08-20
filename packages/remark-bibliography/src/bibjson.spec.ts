import test, { ExecutionContext } from 'ava';
import bibjson from './bibjson.js'

const basic = `{
  "gregory2014": {
    "title": "Game Engine Architecture, Second Edition.",
    "author": [
      {
        "name": "Jason Gregory"
      }
    ],
    "type": "book",
    "year": "2014",
    "publisher": "CRC Press",
    "link": [
      {
        "url": "http://www.gameenginebook.com/"
      }
    ],
    "identifier": [
      {
        "type": "doi",
        "id": "10.1186/1758-2946-3-47"
      }
    ]
  }
}`

const fixtures = [
  [ 'a basic entry', basic ]
]

async function macro(t: ExecutionContext, input: any) {
  const result = bibjson(input)
  t.snapshot(result)
}

macro.title = (name: string) => `bibjson should parse a ${name}`;

for (const fixture of fixtures) {
  const [ name, source ] = fixture
  test(name, macro, source);
}

/*
describe.each(fixtures)('bibjson', (name, source) => {
  it(`should parse ${name}`, () => {
    expect(bibjson(source)).toMatchSnapshot()
  })
})
*/
