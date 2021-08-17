/**
 * Detect metadata and add it to the `data` field of a VFile.
 */
import { toString } from 'mdast-util-to-string'
import { visit } from 'unist-util-visit'
import { select } from 'unist-util-select'
import { parse as toml } from 'toml'
import { load as yaml } from 'js-yaml'
import type { Transformer } from 'unified'
import type { Literal } from 'unist'

export default function metadata(): Transformer {
  return (tree, file) => {
    const heading = select('heading', tree)
    file.data.title = heading ? toString(heading) : ''

    visit(tree, ['yaml'], (node) => {
      const { value } = node as Literal<string>
      file.data = {
        ...file.data,
        ...yaml(value) as any
      }
    })

    visit(tree, ['toml'], (node) => {
      const { value } = node as Literal<string>
      file.data = {
        ...file.data,
        ...toml(value)
      }
    })
  }
}
