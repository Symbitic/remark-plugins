import chicago from 'style-chicago'
import CSL from 'citeproc'
import enUS from 'locale-en-us'
import visit from 'unist-util-visit'

export default function citations (tree, items, opts = {}) {
  const style = opts.style || chicago
  const locale = opts.locale || enUS
  
  const sys = {
    retrieveLocale: () => locale,
    retrieveItem: id => items[id]
  }
  
  // Create Citeproc and add items
  const citeproc = new CSL.Engine(sys, style)
  citeproc.updateItems(Object.keys(items))
  
  // Create citations
  const citations = Object.entries(items)
    .map(([ key, val ]) => ([
      key,
      citeproc.makeCitationCluster([ val ])
        // .replace(/^\(.+)/)$/, '$1')
    ]))
    .reduce((acc, val) => Object.assign(acc, {
      [val[0]]: val[1]
    }), {})
  
  // Create bibliography
  const bibliography = citeproc.makeBibliography()
  const ids = bibliography[0].entry_ids.map(ids => ids.join(''))
  const bib = bibliography[1]
    .map(str => str
      .trim()
      .replace(/<div[^>]+>/g, '')
      .replace(/<\/div>/g, '')
      .replace(/<\/i>/g, '<i>')
      .split('<i>')
      .map((item, i) => (i % 2 === 0 ? {
        type: 'text',
        value: item
      } : {
        type: 'emphasis',
        children: [{ type: 'text', value: item }]
      }))
    )

  // Add citations to MDAST
  Object.entries(citations).forEach(([ id, cite ]) => {
    const key = `(@${id})`
    visit(tree, [ 'text' ], (node, i, parent) => {
      const contains = node.value.includes(key)
      if (!contains) {
        return
      }
      const values = node.value.split(key)
      const children = [
        {
          type: 'text',
          value: values[0]
        },
        {
          type: 'link',
          url: `#ref-${id}`,
          data: {
            hProperties: {
              className: 'citation'
            }
          },
          children: [{ type: 'text', value: cite }]
        },
        {
          type: 'text',
          value: values[1]
        }
      ]
      parent.children.splice(i, 1, ...children)
    })
  })
  
  // Append bibliography to MDAST
  tree.children = tree.children.concat({
    type: 'element',
    data: {
      hName: 'div',
      hProperties: {
        className: 'references'
      }
    },
    children: [
      {
        type: 'heading',
        depth: 2,
        children: [
          {
            type: 'text',
            value: 'References'
          }
        ]
      },
      {
        type: 'list',
        ordered: true,
        spread: false,
        data: {
          hProperties: { className: 'ref-list' }
        },
        children: bib.map((entry, i) => ({
          type: 'listItem',
          spread: false,
          data: {
            hProperties: { id: `ref-${ids[i]}`, className: 'reference' }
          },
          children: entry
        }))
      }
    ]
  })
  
  return tree
}
