/**
 * Rename a URL.
 * Used to change links from `README.md` to `index.html`.
 */
import { visit } from 'unist-util-visit';
import { Transformer } from 'unified';
import { Node } from 'unist';
import { Definition, Link } from 'mdast';

type LinkNode = Definition | Link

export default function rename(): Transformer {
  return (tree) => {
    visit(tree, ['link', 'definition'], (node: Node) => {
      const { url } = node as LinkNode
      (node as LinkNode).url = url
        .replace(/README\.md/, 'index.html')
        .replace(/\.md/, '.html')
    })
  }
}
