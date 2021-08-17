/**
 * Derived from https://github.com/citation-js/name/blob/master/src/input.js
 */
const punctutationMatcher = (str: string) => str.replace(/$|( )|(?!^)(?=[A-Z])/g, '\\.?$1')
const getListMatcher = (list: string[]) => `(?:${list.join('|')})\\b`
const getSplittingRegex = (matcher: string, flags: string) => new RegExp(`(?:^| )(${matcher}$)`, flags)

const titles = [
  'mr', 'mrs', 'ms', 'miss', 'dr', 'herr', 'monsieur', 'hr', 'frau',
  'a v m', 'admiraal', 'admiral', 'air cdre', 'air commodore', 'air marshal',
  'air vice marshal', 'alderman', 'alhaji', 'ambassador', 'baron', 'barones',
  'brig', 'brig gen', 'brig general', 'brigadier', 'brigadier general',
  'brother', 'canon', 'capt', 'captain', 'cardinal', 'cdr', 'chief', 'cik', 'cmdr',
  'coach', 'col', 'col dr', 'colonel', 'commandant', 'commander', 'commissioner',
  'commodore', 'comte', 'comtessa', 'congressman', 'conseiller', 'consul',
  'conte', 'contessa', 'corporal', 'councillor', 'count', 'countess',
  'crown prince', 'crown princess', 'dame', 'datin', 'dato', 'datuk',
  'datuk seri', 'deacon', 'deaconess', 'dean', 'dhr', 'dipl ing', 'doctor',
  'dott', 'dott sa', 'dr', 'dr ing', 'dra', 'drs', 'embajador', 'embajadora', 'en',
  'encik', 'eng', 'eur ing', 'exma sra', 'exmo sr', 'f o', 'father',
  'first lieutient', 'first officer', 'flt lieut', 'flying officer', 'fr',
  'frau', 'fraulein', 'fru', 'gen', 'generaal', 'general', 'governor', 'graaf',
  'gravin', 'group captain', 'grp capt', 'h e dr', 'h h', 'h m', 'h r h', 'hajah',
  'haji', 'hajim', 'her highness', 'her majesty', 'herr', 'high chief',
  'his highness', 'his holiness', 'his majesty', 'hon', 'hr', 'hra', 'ing', 'ir',
  'jonkheer', 'judge', 'justice', 'khun ying', 'kolonel', 'lady', 'lcda', 'lic',
  'lieut', 'lieut cdr', 'lieut col', 'lieut gen', 'lord', 'm', 'm l', 'm r',
  'madame', 'mademoiselle', 'maj gen', 'major', 'master', 'mevrouw', 'miss',
  'mlle', 'mme', 'monsieur', 'monsignor', 'mr', 'mrs', 'ms', 'mstr', 'nti', 'pastor',
  'president', 'prince', 'princess', 'princesse', 'prinses', 'prof', 'prof dr',
  'prof sir', 'professor', 'puan', 'puan sri', 'rabbi', 'rear admiral', 'rev',
  'rev canon', 'rev dr', 'rev mother', 'reverend', 'rva', 'senator', 'sergeant',
  'sheikh', 'sheikha', 'sig', 'sig na', 'sig ra', 'sir', 'sister', 'sqn ldr', 'sr',
  'sr d', 'sra', 'srta', 'sultan', 'tan sri', 'tan sri dato', 'tengku', 'teuku',
  'than puying', 'the hon dr', 'the hon justice', 'the hon miss', 'the hon mr',
  'the hon mrs', 'the hon ms', 'the hon sir', 'the very rev', 'toh puan', 'tun',
  'vice admiral', 'viscount', 'viscountess', 'wg cdr'
]

const suffixes = [
  'I', 'II', 'III', 'IV', 'V', 'Senior', 'Junior', 'Jr', 'Sr', 'PhD', 'Ph\\.D', 'APR',
  'RPh', 'PE', 'MD', 'MA', 'DMD', 'CME', 'BVM', 'CFRE', 'CLU', 'CPA', 'CSC', 'CSJ',
  'DC', 'DD', 'DDS', 'DO', 'DVM', 'EdD', 'Esq', 'JD', 'LLD', 'OD', 'OSB', 'PC', 'Ret',
  'RGS', 'RN', 'RNC', 'SHCJ', 'SJ', 'SNJM', 'SSMO', 'USA', 'USAF', 'USAFR', 'USAR',
  'USCG', 'USMC', 'USMCR', 'USN', 'USNR'
]

const particles = [
  'Vere', 'Von', 'Van', 'De', 'Del', 'Della', 'Di', 'Da', 'Pietro', 'Vanden', 'Du',
  'St.', 'St', 'La', 'Lo', 'Ter', 'O', 'O\'', 'Mac', 'Fitz'
]

const titleMatcher = getListMatcher(titles.map(punctutationMatcher))
const suffixMatcher = getListMatcher(suffixes.map(punctutationMatcher))
const particleMatcher = getListMatcher(particles)
const titleSplitter = new RegExp(`^((?:${titleMatcher} )*)(.*)$`, 'i')
const suffixSplitter = getSplittingRegex(`(?:${suffixMatcher}, )*(?:${suffixMatcher})`, 'i')

/* Not 100% sure these are correct, but Babel REALLY doesn't like the template literals version. */
// const particleSplitter = getSplittingRegex(`${/\p{Uppercase}/u.source}.*`)
const particleSplitter = new RegExp(`(?:^| )(/\p{Uppercase}/u.source.*$)`)
// const endSplitter = getSplittingRegex(`(?:${/\p{Lowercase}/u.source}.*|${particleMatcher}.*|\\S*)`)
const endSplitter = new RegExp(`(?:^| )((?:/\p{Lowercase}/u.source.*|${particleMatcher}.*|\\S*)$)`)

export default function parseName(name: string = '') {
  if (typeof name !== 'string') {
    name = name + ''
  }

  let start: string = ''
  let mid: string = ''
  let end: string = ''

  if (/[^.], /.test(name)) {
    // reversed name
    const parts = name.split(', ')
    end = parts.shift() as string
    const suffixMatch = RegExp(suffixMatcher).exec(parts.join(', '))
    start = parts.splice(suffixMatch && suffixMatch.index !== 0 ? 0 : -1, 1)[0]
    mid = parts.join(', ')
  } else {
    const parts = name.split(suffixSplitter, 2)
    const main = (parts.shift() as string).split(endSplitter, 2)
    start = main[0]
    end = main[1]
    mid = parts.pop() as string
  }

  const [ , droppingParticle, given ] = start.match(titleSplitter) as RegExpMatchArray
  const suffix = mid
  const [ family, nonDroppingParticle ] = end.split(particleSplitter, 2).reverse()

  if (!given && family) {
    return family.includes(' ') ? { literal: family } : { family }
  } else if (family) {
    const nameObject: Record<string, string> = {
      'dropping-particle': droppingParticle,
      given,
      suffix,
      'non-dropping-particle': nonDroppingParticle,
      family
    }

    // remove empty parts (easier than if statement for every part)
    Object.keys(nameObject).forEach((key) => {
      if (!nameObject[key]) {
        delete nameObject[key]
      }
    })

    return nameObject
  } else {
    return {
      literal: name
    }
  }
}
