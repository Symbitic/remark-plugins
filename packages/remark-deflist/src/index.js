/**
 * Remark DefinitionList plugin.
 */

import visit from 'unist-util-visit'
import toString from 'mdast-util-to-string'
import fromMarkdown from 'mdast-util-from-markdown'
import toMarkdown from 'mdast-util-to-markdown'

// Test if deflist is contained in a single paragraph.
const isSingleDeflist = (node) =>
  // i > 0 &&
  /^[^:].+\n:\s/.test(toString(node)) &&
  node.type === 'paragraph'

// Test if deflist is split between two paragraphs.
const isSplitDeflist = (node, i, parent) =>
  i > 0 &&
  /^:\s/.test(toString(node)) &&
  !/^:\s/.test(toString(parent.children[i - 1])) &&
  node.type === 'paragraph' &&
  parent.children[i - 1].type === 'paragraph'

const isdeflist = (node, i, parent) => isSingleDeflist(node) || isSplitDeflist(node, i, parent)

export default function deflist(options = {}) {
  return (tree, file) => {
    visit(tree, ['paragraph'], (node, i, parent) => {
      const isdef = isdeflist(node, i, parent)
      if (!isdef) {
        return
      }

      let dd = undefined;
      let dt = undefined;
      let count = 0;
      let start = 0;

      if (isSingleDeflist(node)) {
        const [ title, ...children ] = toMarkdown(node).split(/\n:\s+/)

        dt = fromMarkdown(title).children.flatMap(({ children }) => children)
        dd = children
          .map(fromMarkdown)
          .flatMap(({ children }) => children)
          .map(({ children }) => ({
            type: 'descriptiondetails',
            data: {
              hName: 'dd'
            },
            children
          }))
        start = i
        count = 1
      } else {
        dt = parent.children[i - 1].children
        dd = toMarkdown(node)
          .replace(/^:\s+/, '')
          .split(/\n:\s+/)
          .map(fromMarkdown)
          .flatMap(({ children }) => children)
          .map(({ children }) => ({
            type: 'descriptiondetails',
            data: {
              hName: 'dd'
            },
            children
          }))
        start = i - 1
        count = 2

        //console.log(node.children)
      }

      const child = {
        type: 'descriptionlist',
        data: {
          hName: 'dl'
        },
        children: [
          {
            type: 'descriptionterm',
            data: {
              hName: 'dt'
            },
            children: dt
          },
          ...dd
        ]
      }

      parent.children.splice(start, count, child)
    })
  }
}
