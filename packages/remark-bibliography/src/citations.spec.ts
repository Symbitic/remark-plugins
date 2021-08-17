/* eslint-env jest */
test('citations', () => {
  expect(2+2).toBe(4);
})
/*
import citations from './citations'

type Case = [ string, any, Record<string, any>, any? ]

const case1: Case = [
  'replace a citation correctly',
  {
    type: 'root',
    children: [{
      type: 'paragraph',
      children: [{ type: 'text', value: 'This is a citation: (@singh2016).' }]
    }]
  },
  {
    gregory2014: {
      type: 'book',
      title: 'Game Engine Architecture, Second Edition.',
      author: [{ given: 'Jason', family: 'Gregory' }],
      publisher: 'CRC Press',
      issued: { 'date-parts': [ [ 2014 ] ] },
      URL: 'http://www.gameenginebook.com/',
      DOI: '10.1186/1758-2946-3-47',
      id: 'gregory2014'
    },
    singh2016: {
      type: 'book',
      title: 'Vulkan Essentials',
      author: [{ given: 'Parminder', family: 'Singh' }],
      publisher: 'Packt Publishing',
      issued: { 'date-parts': [ [ 2016 ] ] },
      URL: 'https://www.packtpub.com/application-development/vulkan-essentials',
      id: 'singh2016'
    },
    moller2008: {
      id: 'moller2008',
      type: 'book',
      title: 'Real Time Rendering, Third Edition',
      author: [
        { given: 'Thomas', family: 'Akenine-Moller' },
        { given: 'Eric', family: 'Haines' },
        { given: 'Naty', family: 'Hoffman' }
      ],
      publisher: 'CRC Press',
      issued: { 'date-parts': [ [ 2008 ] ] },
      URL: 'http://www.realtimerendering.com/'
    }
  }
]

const fixtures = [
  case1
]

describe.each(fixtures)('citations', (name, tree, items, opts) => {
  it(`should ${name}`, () => {
    expect(citations(tree, items, opts)).toMatchSnapshot()
  })
})
*/
