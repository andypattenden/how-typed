import path from 'path'
import fs from 'fs/promises'
import { minimatch } from 'minimatch'
import {
  defaultExcludedFilePatterns,
  allFileExtensions,
  fileTypeExtensions,
  fileWeighting,
  locWeighting,
} from '../constants.js'
import { getVueSfcScriptType } from '../matchers/vue.js'
import type { Counts } from '../@types/index.js'

export function calculatePercentage(value: number, total: number) {
  return Number(((value / total) * 100).toFixed(2))
}

export function calculateScores(counts: Counts) {
  Object.keys(counts.filetypes).forEach((key) => {
    const count = counts.filetypes[key]
    if (count.total.files > 0) {
      count.percentages = count.percentages || {}
      count.percentages.files = {
        ts: calculatePercentage(count.ts.files, count.total.files),
        js: calculatePercentage(count.js.files, count.total.files),
      }

      if (count.total.loc > 0) {
        count.percentages.loc = {
          ts: calculatePercentage(count.ts.loc, count.total.loc),
          js: calculatePercentage(count.js.loc, count.total.loc),
        }
      }

      count.score = calculateScore(
        count.percentages.files.ts,
        count.percentages.loc.ts,
      )
    }
  })

  const totalTsCounts = getTotalsCountForFiletype(counts, 'ts')
  const totalJsCounts = getTotalsCountForFiletype(counts, 'js')

  counts.percentages = {
    files: {
      ts: calculatePercentage(totalTsCounts.files, counts.total.files),
      js: calculatePercentage(totalJsCounts.files, counts.total.files),
    },
    loc: {
      ts: calculatePercentage(totalTsCounts.loc, counts.total.loc),
      js: calculatePercentage(totalJsCounts.loc, counts.total.loc),
    },
  }

  counts.score = calculateScore(
    counts.percentages.files.ts,
    counts.percentages.loc.ts,
  )

  return counts
}

export const getIgnorePatterns = async (directoryPath: string) => {
  const excludedFilePatterns = [...defaultExcludedFilePatterns]
  const gitignorePath = path.join(directoryPath, '.gitignore')

  try {
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8')

    excludedFilePatterns.push(
      ...gitignoreContent
        .split('\n')
        .map((pattern) => pattern.trim())
        .filter((pattern) => pattern && !pattern.startsWith('#')),
    )
  } catch {
    // No .gitignore file found
  }

  return excludedFilePatterns
}

export const isFileIgnored = (
  filePath: string,
  excludedFilePatterns: string[],
) => excludedFilePatterns.some((pattern) => minimatch(filePath, pattern))

export const getTotalsCountForFiletype = (
  counts: Counts,
  language: 'js' | 'ts',
) =>
  Object.values(counts.filetypes).reduce(
    (acc, value) => {
      acc.files += value[language].files || 0
      acc.loc += value[language].loc || 0
      return acc
    },
    {
      files: 0,
      loc: 0,
    },
  )

export const incrementFileTypeCounts = async (
  filePath: string,
  counts: Counts,
) => {
  const extension = path.extname(filePath)

  if (!allFileExtensions.includes(extension)) {
    return counts
  }

  const fileContent = await fs.readFile(filePath, 'utf-8')

  if (fileTypeExtensions.vue.includes(extension)) {
    const vueSfcScriptType = await getVueSfcScriptType(fileContent)

    if (vueSfcScriptType) {
      const scriptBlockMatch = fileContent.match(
        /<script.*?>([\s\S]*?)<\/script>/,
      )
      let loc = 0
      if (scriptBlockMatch) {
        const scriptContent = scriptBlockMatch[1]
        loc = countLinesOfCode(scriptContent)

        counts.filetypes.vue[vueSfcScriptType].loc =
          (counts.filetypes.vue[vueSfcScriptType].loc || 0) + loc
      }

      counts.filetypes.vue[vueSfcScriptType].files++
      // only increment the total if it's a Vue SFC with a script block
      counts.filetypes.vue.total.files++
      counts.filetypes.vue.total.loc += loc
      counts.total.files++
      counts.total.loc += loc
    }
  } else if (fileTypeExtensions.js.includes(extension)) {
    const loc = countLinesOfCode(fileContent)
    counts.filetypes.plain.js.files++
    counts.filetypes.plain.js.loc += loc
    counts.filetypes.plain.total.files++
    counts.filetypes.plain.total.loc += loc
    counts.total.files++
    counts.total.loc += loc
  } else if (fileTypeExtensions.ts.includes(extension)) {
    const loc = countLinesOfCode(fileContent)
    counts.filetypes.plain.ts.files++
    counts.filetypes.plain.ts.loc += loc
    counts.filetypes.plain.total.files++
    counts.filetypes.plain.total.loc += loc
    counts.total.files++
    counts.total.loc += loc
  }

  return counts
}

export const countLinesOfCode = (content: string) => {
  const lines = content.split('\n')
  let inBlockComment = false
  const codeLines = lines.filter((line) => {
    const trimmedLine = line.trim()
    if (trimmedLine.startsWith('/*')) {
      inBlockComment = true
    }
    if (trimmedLine.endsWith('*/')) {
      inBlockComment = false
      return false
    }
    if (inBlockComment || trimmedLine.startsWith('//')) {
      return false
    }
    if (trimmedLine === '') {
      return false
    }
    return true
  })

  return codeLines.length
}

export const calculateScore = (
  filePercentage: number,
  locPercentage: number,
) => {
  return Number(
    (filePercentage * fileWeighting + locPercentage * locWeighting).toFixed(2),
  )
}
