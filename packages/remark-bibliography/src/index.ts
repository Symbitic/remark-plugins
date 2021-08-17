/**
 * Bibliography & Citations for Remark.
 */
import path from 'path'
import util from 'util'
import fs from 'fs'

import apa from 'style-apa'
import vancouver from 'style-vancouver'
import mla from 'style-mla'
import chicago from 'style-chicago'

import deDE from 'locale-de-de'
import enGB from 'locale-en-gb'
import enUS from 'locale-en-us'
import esES from 'locale-es-es'
import frFR from 'locale-fr-fr'

import bibjson from './bibjson'
import citations from './citations'

import type { Transformer } from 'unified'
import type { Data, Node } from 'unist'

const readFile = util.promisify(fs.readFile)

function format(data: string, ext: string) {
  const parsers: Record<string, any> = {
    '.json': bibjson
  }

  if (!parsers.hasOwnProperty(ext)) {
    return Promise.reject(new Error(`Unrecognized format: ${ext}`))
  }

  const parser = parsers[ext]

  const items = parser(data)

  return items
}

export interface Bibliography {}

export default function bibliography(_options: Bibliography = {}): Transformer {
  const styles: Record<string, any> = {
    'apa': apa,
    'chicago': chicago,
    'mla': mla,
    'vancouver': vancouver
  }

  const locales: Record<string, any> = {
    'de-de': deDE,
    'en-gb': enGB,
    'en-us': enUS,
    'es-es': esES,
    'fr-fr': frFR
  }

  return async (tree, file): Promise<Node<Data>> => {
    if (!file.data.hasOwnProperty('bibliography')) {
      return Promise.resolve(tree)
    }

    const dir = path.dirname(file.history[file.history.length - 1])
    const bibfile = path.resolve(dir, file.data.bibliography as string)

    const style = file.data.hasOwnProperty('style')
      ? (file.data.style as string).toLowerCase()
      : 'chicago'
    const locale = file.data.hasOwnProperty('locale')
      ? (file.data.locale as string).toLowerCase()
      : 'en-us'

    if (!styles.hasOwnProperty(style)) {
      return Promise.reject(new Error(`Unrecognized style: ${style}`))
    } else if (!locales.hasOwnProperty(locale)) {
      return Promise.reject(new Error(`Unrecognized locale: ${locale}`))
    }

    const opts = {
      style: styles[style],
      locale: locales[locale]
    }

    const data = await readFile(bibfile, 'utf8')
    const items = format(data, path.extname(bibfile))
    return citations(tree, items, opts)
  }
}
