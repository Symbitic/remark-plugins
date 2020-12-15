/**
 * @fileoverview Bibliography & Citations for Remark.
 * @author Alex Shaw
 */
import path from 'path'
import bibjson from './bibjson'
import citations from './citations'
import apa from 'style-apa'
import vancouver from 'style-vancouver'
import mla from 'style-mla'
import chicago from 'style-chicago'
import deDE from 'locale-de-de'
import enGB from 'locale-en-gb'
import enUS from 'locale-en-us'
import esES from 'locale-es-es'
import frFR from 'locale-fr-fr'
import util from 'util'
import fs from 'fs'

const readFile = util.promisify(fs.readFile)

function format (data, ext) {
  const parsers = {
    '.json': bibjson
  }

  if (!parsers.hasOwnProperty(ext)) {
    return Promise.reject(new Error(`Unrecognized format: ${ext}`))
  }

  const parser = parsers[ext]

  const items = parser(data)

  return items
}

export default function bibliography (options = {}) {
  const styles = {
    'apa': apa,
    'chicago': chicago,
    'mla': mla,
    'vancouver': vancouver
  }

  const locales = {
    'de-de': deDE,
    'en-gb': enGB,
    'en-us': enUS,
    'es-es': esES,
    'fr-fr': frFR
  }

  return async (tree, file) => {
    if (!file.data.hasOwnProperty('bibliography')) {
      return Promise.resolve(tree)
    }

    const dir = path.dirname(file.history[file.history.length - 1])
    const bibfile = path.resolve(dir, file.data.bibliography)

    const style = file.data.hasOwnProperty('style')
      ? file.data.style.toLowerCase()
      : 'chicago'
    const locale = file.data.hasOwnProperty('locale')
      ? file.data.locale.toLowerCase()
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

    return readFile(bibfile, 'utf8')
      .then(data => format(data, path.extname(bibfile)))
      .then(items => citations(tree, items, opts))
  }
}
