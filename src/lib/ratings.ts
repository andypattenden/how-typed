import type { FormattingColours } from '../@types/index.js'

export type Rating = {
  threshold: number
  label: string
  fg: FormattingColours
  bg: FormattingColours
  emoji: string
}

const excellent: Rating = {
  threshold: 90,
  label: 'Excellent',
  fg: 'green',
  bg: 'bgGreen',
  emoji: '🚀',
}

const great: Rating = {
  threshold: 75,
  label: 'Great',
  fg: 'yellowGreen',
  bg: 'bgYellowGreen',
  emoji: '🎉',
}

const good: Rating = {
  threshold: 60,
  label: 'Good',
  fg: 'yellow',
  bg: 'bgYellow',
  emoji: '👍',
}

const fair: Rating = {
  threshold: 50,
  label: 'Fair',
  fg: 'orange',
  bg: 'bgOrange',
  emoji: '🤏',
}

const needsImprovement: Rating = {
  threshold: 30,
  label: 'Needs Improvement',
  fg: 'orangeRed',
  bg: 'bgOrangeRed',
  emoji: '😕',
}

const poor: Rating = {
  threshold: 0,
  label: 'Poor',
  fg: 'red',
  bg: 'bgRed',
  emoji: '😞',
}

const noRating: Rating = {
  threshold: -1,
  label: 'No Rating',
  fg: 'white',
  bg: 'bgBlack',
  emoji: '🤷',
}

export const ratings: Rating[] = [
  excellent,
  great,
  good,
  fair,
  needsImprovement,
  poor,
]
  // Sort the ratings so that if the order changes, the correct rating is still returned
  .slice()
  .sort((a, b) => b.threshold - a.threshold)

/**
 *
 * @param percentage the percentage to be rated
 * @returns the rating
 */
export function getRating(percentage: number) {
  for (const rating of ratings) {
    if (percentage >= rating.threshold) {
      return rating
    }
  }

  return noRating
}
