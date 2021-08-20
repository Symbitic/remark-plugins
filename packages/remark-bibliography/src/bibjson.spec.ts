import bibjson from './bibjson'

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

describe.each(fixtures)('bibjson', (name, source) => {
  it(`should parse ${name}`, () => {
    expect(bibjson(source)).toMatchSnapshot()
  })
})
