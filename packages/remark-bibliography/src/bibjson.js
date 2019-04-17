import parseDate from './utils/date'
import parseName from './utils/name'

const identifiers = [ 'PMID', 'PMCID', 'DOI', 'ISBN' ]
const journalIdentifiers = [ 'ISSN' ]
const types = {
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

function nameProps (person) {
  const {
    firstname,
    lastname,
    firstName: given = firstname,
    lastName: family = lastname
  } = person

  if (given && family) {
    return { given, family }
  } else if (person.name) {
    return parseName(person.name)
  }
}

function idProps (input, identifiers) {
  let output = {}

  for (let prop in input) {
    let upperCaseProp = prop.toUpperCase()

    if (identifiers.includes(upperCaseProp)) {
      output[upperCaseProp] = input[prop]
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

export default function bibjson (data) {
  return Object.entries(JSON.parse(data))
    .map(([ id, input ]) => {
      let output = {
        type: types[input.type] || 'book'
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
    
        Object.assign(output, idProps(journal, journalIdentifiers))
    
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
    
      Object.assign(output, idProps(input, identifiers))
    
      if (input.id) {
        output.id = input.id
      } else {
        output.id = id
      }
    
      return [ id, output ]
    })
    .reduce((acc, val) => Object.assign(acc, {
      [val[0]]: val[1]
    }), {})
}
