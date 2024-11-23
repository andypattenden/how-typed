import { formattingColours } from '../constants.js'

export type FileStatistics = {
  files: number
  loc: number
}

export type LanguageDistributionPercentages = {
  files: {
    ts: number
    js: number
  }
  loc: {
    ts: number
    js: number
  }
}

export type Score = number

export type Counts = {
  filetypes: {
    [key: string]: {
      label: string
      js: FileStatistics
      ts: FileStatistics
      percentages: LanguageDistributionPercentages
      score: Score
      total: FileStatistics
    }
  }
  total: FileStatistics
  percentages: LanguageDistributionPercentages
  score: Score
}

export type FormattingColours = keyof typeof formattingColours
