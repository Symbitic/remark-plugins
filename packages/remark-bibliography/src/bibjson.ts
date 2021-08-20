import parseDate from './utils/date.js'
import parseName from './utils/name.js'

export type RECORD_TYPE = 'article' | 'book' | 'booklet' | 'proceedings' | 'mastersthesis'
  | 'inbook' | 'incollection' | 'conference' | 'inproceedings' | 'phdthesis'
  | 'techreport' | 'unpublished' | 'manual' | 'misc';

export type IdentifierType = 'pmsid' | 'pmcid' | 'doi' | 'isbn'

export type JOURNAL_IDENTIFIER = 'ISSN';

export interface Person {
  id?: string;
  name: string;
  firstname?: string;
  lastname?: string;
  alternate?: string[];
}

export interface Link {
  url: string;
}

export interface Identifier {
  type: IdentifierType;
  id: string;
}

export interface Journal {
  name: string;
  identifier: Identifier[];
  volume: string;
  pages: string;
  issue?: string;
  firstpage?: string;
  lastpage?: string;
}

interface BibDate {
  submitted?: string;
  published?: string;
}

export interface BibJSON {
  id?: string;
  title: string;
  author: Person[];
  publisher?: Person;
  reviewer?: Person[];
  editor: Person[];
  type: RECORD_TYPE;
  year: string;
  link: Link[];
  keywords?: string[];
  date?: BibDate;
  journal?: Journal;
}

const IDENTIFIERS = [ 'PMID', 'PMCID', 'DOI', 'ISBN' ]

const JOURNAL_IDENTIFIERS = [ 'ISSN' ]

const RECORD_TYPES = {
  article: 'article',
  book: 'book',
  booklet: 'book',
  proceedings: 'book',
  mastersthesis: 'thesis',
  inbook: 'chapter',
  incollection: 'chapter',
  conference: 'paper-conference',
  inproceedings: 'paper-conference',
  online: 'website',
  patent: 'patent',
  phdthesis: 'thesis',
  techreport: 'report',
  unpublished: 'manuscript',
  manual: undefined,
  misc: undefined
}

function nameProps(person: Person) {
  const {
    firstname,
    lastname
  } = person

  if (firstname && lastname) {
    return { firstname, lastname }
  } else if (person.name) {
    return parseName(person.name)
  }
}

function idProps(input: Record<string, any>, identifiers: string[]) {
  let output: any = {}

  for (let prop in input) {
    let propName = prop.toLowerCase()

    if (identifiers.includes(propName)) {
      output[propName] = input[prop]
    }
  }

  if (input.identifier) {
    for (let { id, type = '' } of input.identifier) {
      type = type.toUpperCase()
      if (identifiers.includes(type)) {
        output[type] = id
      }
    }
  }

  return output
}

type RecordEntry = [ string, BibJSON ]

export default function bibjson(data: string) {
  const entries: RecordEntry[] = Object.entries(JSON.parse(data))
  const records = entries.map(([ id, input ]) => {
      let output: any = {
        type: RECORD_TYPES[input.type] || 'book'
      }

      if (input.title) {
        output.title = input.title
      }
      if (input.author) {
        output.author = input.author.map(nameProps).filter(Boolean)
      }
      if (input.editor) {
        output.editor = input.editor.map(nameProps).filter(Boolean)
      }
      if (input.publisher) {
        output.publisher = input.publisher.name || input.publisher
      }
      if (input.reviewer) {
        if (input.author) {
          output['reviewed-author'] = output.author
        }
        output.author = input.reviewer.map(nameProps).filter(Boolean)
      }
      if (input.keywords) {
        output.keyword = Array.isArray(input.keywords)
          ? input.keywords.join()
          : input.keywords
      }

      if (input.date && Object.keys(input.date).length > 0) {
        let dates = input.date
        if (dates.submitted) {
          output.submitted = parseDate(dates.submitted)
        }
        if (dates.published) {
          output.issued = parseDate(dates.published)
        }
      } else if (input.year) {
        output.issued = {
          'date-parts': [[+input.year]]
        }
      }
      if (input.journal) {
        let journal = input.journal
        if (journal.name) {
          output['container-title'] = journal.name
        }
        if (journal.volume) {
          output.volume = +journal.volume
        }
        if (journal.issue) {
          output.issue = +journal.issue
        }

        Object.assign(output, idProps(journal, JOURNAL_IDENTIFIERS))

        if (journal.firstpage) {
          output['page-first'] = journal.firstpage
        }
        if (journal.pages) {
          output.page = journal.pages.replace('--', '-')
        } else if (journal.firstpage && journal.lastpage) {
          output.page = journal.firstpage + '-' + journal.lastpage
        }
      }

      if (input.link && typeof input.link[0] === 'object') {
        output.URL = input.link[0].url
      }

      Object.assign(output, idProps(input, IDENTIFIERS))

      if (input.id) {
        output.id = input.id
      } else {
        output.id = id
      }

      return [ id, output ]
    });
  return records
    .reduce((acc, val) => Object.assign(acc, {
      [val[0]]: val[1]
    }), {}) as BibJSON
}
