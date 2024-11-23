import Table from 'cli-table3'
import chalk from 'chalk'
import type {
  FileStatistics,
  LanguageDistributionPercentages,
  Score,
} from '../@types/index.js'
import { formatPercentageString, formatRating } from './formatting.js'
import { getRating } from './ratings.js'

const headingColor = 'blueBright'

export function buildTableRow(
  rowTitle: string,
  jsCount: FileStatistics,
  tsCount: FileStatistics,
  percentages: LanguageDistributionPercentages,
  total: FileStatistics,
  score: Score,
  bold = false,
): Table.HorizontalTableRow[] {
  const cellValue = (value: string | number) =>
    bold ? chalk.bold(value) : value

  return [
    [
      { content: cellValue(rowTitle), rowSpan: 2 },
      cellValue('Files'),
      cellValue(jsCount.files),
      cellValue(tsCount.files),
      cellValue(total.files),
      cellValue(formatPercentageString(percentages.files.ts)),
      {
        content: cellValue(formatRating(getRating(score))),
        rowSpan: 2,
        vAlign: 'center',
      },
    ],
    [
      cellValue('LoC'),
      cellValue(jsCount.loc),
      cellValue(tsCount.loc),
      cellValue(total.loc),
      cellValue(formatPercentageString(percentages.loc.ts)),
    ],
  ]
}

export const buildTable = (rows: Table.HorizontalTableRow[]) => {
  const table = new Table({
    head: [
      chalk[headingColor]('File Type'),
      chalk[headingColor]('Metric'),
      chalk.bgYellow.black(' JS'),
      chalk.bgBlue.white(' TS'),
      chalk[headingColor]('Total'),
      `${chalk.bgBlue.white(' TS')} ${chalk[headingColor]('%')}`,
      chalk[headingColor]('Rating'),
    ].map((header) => chalk.bold(header)),
  })

  rows.forEach((row) => {
    table.push(row)
  })

  return table
}
