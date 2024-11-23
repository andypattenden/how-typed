import chalk from 'chalk'
import { formattingColours } from '../constants.js'
import type { FormattingColours } from '../@types/index.js'
import { ratings, type Rating } from './ratings.js'

export function formatString(
  string: string,
  fgColour: FormattingColours,
  bgColour: FormattingColours,
  bold = true,
  prefix = '',
  suffix = '',
) {
  const message = `${prefix}${chalk.bgHex(formattingColours[bgColour]).hex(formattingColours[fgColour])(`${string}${suffix}`)}`
  return bold ? chalk.bold(message) : message
}

export function formatRating(rating: Rating) {
  return `${formatString(rating.label, rating.fg, rating.bg)} ${rating.emoji}`
}

export function formatPercentageString(percentage: number) {
  for (const rating of ratings) {
    if (percentage >= rating.threshold) {
      return formatString(
        percentage.toFixed(2),
        rating.fg,
        rating.bg,
        true,
        '',
        '%',
      )
    }
  }

  // If the percentage is less than the lowest threshold, return it in white
  return formatString(percentage.toFixed(2), 'white', 'bgBlack', true, '', '%')
}
