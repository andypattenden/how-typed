import chalk from 'chalk'
import { formattingColours, subHeadingColours } from '../constants.js'
import type { Counts } from '../@types/index.js'
import { formatPercentageString, formatRating } from './formatting.js'
import { buildTableRow, buildTable } from './table.js'
import { getTotalsCountForFiletype } from './utils.js'
import { getRating } from './ratings.js'

const subheadingUnderlineCharacter = '\u2015'

export function outputHeader(title: string) {
  const bannerGraphicTopRow = `${chalk.bold.bgHex(formattingColours.tsLogo)('      ')}    ${chalk.bold.bgHex(formattingColours.jsLogo)('      ')}`
  const bannerGraphicBottomRow = `${chalk.bold.bgHex(formattingColours.tsLogo).hex(formattingColours.white)('   TS ')} vs ${chalk.bold.bgHex(formattingColours.jsLogo).hex(formattingColours.black)('   JS ')}`

  const headerBoxPadding = 4

  const logoLength = 16
  const rowLength = Math.max(title.length, logoLength) + headerBoxPadding * 2

  const logoSpacing = ' '.repeat(
    Math.max(
      (title.length - logoLength) / 2 + headerBoxPadding,
      headerBoxPadding,
    ),
  )

  // Add extra space to the logo if the title is longer than the logo and odd length
  const addExtraLogoSpace =
    title.length % 2 !== 0 && title.length > logoLength ? ' ' : ''
  // Add extra space to the title if the title is shorter than the logo and odd length
  const addExtraTitleSpace =
    title.length % 2 !== 0 && title.length < logoLength ? ' ' : ''
  const titleSpacing = ' '.repeat(
    Math.max((logoLength - title.length) / 2 + 4, headerBoxPadding),
  )
  const topRow = `\n\u2554${'\u2550'.repeat(rowLength)}\u2557\n`
  const logoRow = `\u2551${logoSpacing}${bannerGraphicTopRow}${logoSpacing}${addExtraLogoSpace}\u2551\n\u2551${logoSpacing}${bannerGraphicBottomRow}${logoSpacing}${addExtraLogoSpace}\u2551\n`

  const titleRow = `\u2551${titleSpacing}${chalk.bold(title)}${titleSpacing}${addExtraTitleSpace}\u2551\n`

  const blankRow = `\u2551${' '.repeat(rowLength)}\u2551\n`
  const bottomRow = `\u255A${'\u2550'.repeat(rowLength)}\u255D\n`

  console.log(`${topRow}${logoRow}${blankRow}${titleRow}${bottomRow}`)
}

export function outputSubheader(title: string) {
  console.log(
    chalk.bold[subHeadingColours.fg](
      `\n${title}\n${subheadingUnderlineCharacter.repeat(title.length)}`,
    ),
  )
}

export function outputReportSummary(counts: Counts) {
  outputSubheader('Summary')

  const overallPercentages = counts.percentages

  const summary = overallPercentages
    ? `Overall, ${chalk.bold(formatPercentageString(overallPercentages.files.ts))} of files and ${chalk.bold(formatPercentageString(overallPercentages.loc.ts))} of lines of code (LoC) are written in TypeScript, earning a ${chalk.bold(formatRating(getRating(overallPercentages.files.ts)))} rating for file coverage and a ${formatRating(getRating(overallPercentages.loc.ts))} rating for LoC coverage.`
    : 'Summary not available'

  // TODO: calculate the best category for files
  // const bestCategoryForLoC = getBestCategoryForLoc(counts)
  // const bestCategoryForFiles = getBestCategoryForFiles(counts)

  // TODO: calculate the categories for improvements

  console.log(summary)
}

export function outputReport(title: string, counts: Counts, json = false) {
  if (counts.total.files === 0) {
    console.log(
      chalk.red('🙅 No JavaScript or TypeScript files found in the directory'),
    )
  } else {
    if (json) {
      console.log(JSON.stringify(counts, null, 2))
      return
    }

    outputToConsole(title, counts)
  }
}

const outputToConsole = (title: string, counts: Counts) => {
  outputHeader(title)

  const tableRows = []

  Object.keys(counts.filetypes)
    .sort()
    .forEach((key) => {
      const count = counts.filetypes[key]
      if (count.total.files > 0) {
        tableRows.push(
          ...buildTableRow(
            count.label,
            count.js,
            count.ts,
            count.percentages,
            count.total,
            count.score,
          ),
        )
      }
    })

  const totalJsCounts = getTotalsCountForFiletype(counts, 'js')
  const totalTsCounts = getTotalsCountForFiletype(counts, 'ts')

  tableRows.push(
    ...buildTableRow(
      'OVERALL',
      totalJsCounts,
      totalTsCounts,
      counts.percentages,
      counts.total,
      counts.score,
      true,
    ),
  )

  const table = buildTable(tableRows)

  console.log(table.toString())

  outputReportSummary(counts)
}
