/**
 * Derived from https://github.com/citation-js/date/blob/master/src/input.js
 */
const ISO8601 = /^(\d{4}|[-+]\d{6,})-(\d{2})-(\d{2})/
const RFC2822 = /^(?:[a-z]{3},\s*)?(\d{1,2}) ([a-z]{3}) (\d{4,})/i
const AMERICAN_DAY = /^(\d{1,2})\/(\d{1,2})\/(\d{2}(?:\d{2})?)/
const REGULAR_DAY = /^(\d{1,2})[ .\-/](\d{1,2}|[a-z]{3,10})[ .\-/](-?\d+)/i
const REVERSE_DAY = /^(-?\d+)[ .\-/](\d{1,2}|[a-z]{3,10})[ .\-/](\d{1,2})/i
const MONTH = /^([a-z]{3,10}|-?\d+)[^\w-]+([a-z]{3,10}|-?\d+)$/i
const YEAR = /^-?\d+$/

const getMonth = month => ({
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12
}[ month.toLowerCase().slice(0, 3) ])

/*
const isEpoc = date => {
  const epoch = new Date(date)
  return typeof date === 'number' && !isNaN(epoch.valueOf())
}
const isIso8601 = date => typeof date === 'string' && ISO8601.test(date)
const isRfc2822 = date => typeof date === 'string' && RFC2822.test(date)
  && getMonth(date.match(RFC2822)[2])
const isAmericanDay = date => {
  if (typeof date === 'string' && AMERICAN_DAY.test(date)) {
    const [ , month, day, year ] = date.match(AMERICAN_DAY)
    const check = new Date(year, month, day)
    return check.getMonth() === parseInt(month)
  }
  return false
}
*/

function parseEpoch (date) {
  let epoch = new Date(date)

  if (typeof date === 'number' && !isNaN(epoch.valueOf())) {
    return [ epoch.getFullYear(), epoch.getMonth() + 1, epoch.getDate() ]
  } else {
    return null
  }
}

function parseIso8601 (date) {
  if (typeof date !== 'string' || !ISO8601.test(date)) {
    return null
  }

  let [ , year, month, day ] = date.match(ISO8601)

  if (!+month) {
    return [ year ]
  } else if (!+day) {
    return [ year, month ]
  } else {
    return [ year, month, day ]
  }
}

function parseRfc2822 (date) {
  if (typeof date !== 'string' || !RFC2822.test(date)) {
    return null
  }

  let [ , day, month, year ] = date.match(RFC2822)

  month = getMonth(month)
  if (!month) {
    return null
  }

  return [ year, month, day ]
}

function parseAmericanDay (date) {
  if (typeof date !== 'string' || !AMERICAN_DAY.test(date)) {
    return null
  }

  let [ , month, day, year ] = date.match(AMERICAN_DAY)

  let check = new Date(year, month, day)
  if (check.getMonth() === parseInt(month)) {
    return [ year, month, day ]
  } else {
    return null
  }
}

function parseDay (date) {
  let year
  let month
  let day

  if (typeof date !== 'string') {
    return null
  } else if (REGULAR_DAY.test(date)) {
    [ , day, month, year ] = date.match(REGULAR_DAY)
  } else if (REVERSE_DAY.test(date)) {
    [ , year, month, day ] = date.match(REVERSE_DAY)
  } else {
    return null
  }

  if (getMonth(month)) {
    month = getMonth(month)
  } else if (isNaN(month)) {
    return null
  }

  return [ year, month, day ]
}

function parseMonth (date) {
  if (typeof date === 'string' && MONTH.test(date)) {
    let values = date.match(MONTH).slice(1, 3)

    let month
    if (getMonth(values[1])) {
      month = getMonth(values.pop())
    } else if (getMonth(values[0])) {
      month = getMonth(values.shift())
    } else if (values.some(isNaN) || values.every(value => +value < 0)) {
      return null
    } else if (+values[0] < 0) {
      month = values.pop()
    } else if (+values[0] > +values[1] && +values[1] > 0) {
      month = values.pop()
    } else {
      month = values.shift()
    }

    let year = values.pop()

    return [ year, month ]
  } else {
    return null
  }
}

function parseYear (date) {
  if (typeof date === 'string' && YEAR.test(date)) {
    return [date]
  } else {
    return null
  }
}

export default function parseDate (value) {
  const date = parseEpoch(value)
    || parseIso8601(value)
    || parseRfc2822(value)
    || parseAmericanDay(value)
    || parseDay(value)
    || parseMonth(value)
    || parseYear(value)
  
  return date ? {
    // 'date-parts': [ date.map(string => parseInt(string)) ]
    'date-parts': [ date.map(str => str.length > 2 ? str : parseInt(str)) ]
  } : {
    raw: value
  }
}
