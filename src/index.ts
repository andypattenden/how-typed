/**
 * This script calculates and outputs TypeScript Percentage metrics for a given directory.
 * It counts the number of JavaScript, TypeScript, and Vue files, and generates a report
 * with the Percentage percentage and colour-coded messages.
 *
 * Usage: `how-typed.js [directoryPath]`
 *
 * If no directory path is provided, the current working directory is used.
 *
 * The script supports ignoring files based on patterns specified in a .gitignore file
 * or default patterns such as 'node_modules', 'dist', and 'build'.
 */

import fs from 'fs/promises'
import path from 'path'
import ora from 'ora'
import { Command } from 'commander'
import {
  calculateScores,
  isFileIgnored,
  getIgnorePatterns,
  incrementFileTypeCounts,
} from './lib/utils.js'
import { outputReport } from './lib/output.js'

import type { Counts } from './@types/index.js'

import { version } from './lib/version.js'

const program = new Command()

async function summariseDirectoryFilesByType(
  directory: string,
  filetypeCounts?: Counts,
): Promise<Counts> {
  let counts = filetypeCounts || {
    filetypes: {
      vue: {
        label: 'Vue SFC',
        js: {
          files: 0,
          loc: 0,
        },
        ts: {
          files: 0,
          loc: 0,
        },
        total: {
          files: 0,
          loc: 0,
        },
        score: 0,
        percentages: {
          files: {
            ts: 0,
            js: 0,
          },
          loc: {
            ts: 0,
            js: 0,
          },
        },
      },
      plain: {
        label: 'Plain JS/TS',
        js: {
          files: 0,
          loc: 0,
        },
        ts: {
          files: 0,
          loc: 0,
        },
        total: {
          files: 0,
          loc: 0,
        },
        score: 0,
        percentages: {
          files: {
            ts: 0,
            js: 0,
          },
          loc: {
            ts: 0,
            js: 0,
          },
        },
      },
    },
    total: {
      files: 0,
      loc: 0,
    },
    percentages: {
      files: {
        ts: 0,
        js: 0,
      },
      loc: {
        ts: 0,
        js: 0,
      },
    },
    score: 0,
  }

  // Create a deep copy of the counts object to avoid mutating the original object
  counts = JSON.parse(JSON.stringify(counts))

  const files = await fs.readdir(directory)

  for (const file of files) {
    const fullPath = path.join(directory, file)
    const relativePath = path.relative(directoryPath, fullPath)

    if (isFileIgnored(relativePath, excludedFilePatterns)) {
      continue
    }

    try {
      if ((await fs.stat(fullPath)).isDirectory()) {
        counts = await summariseDirectoryFilesByType(fullPath, counts)
      } else {
        counts = await incrementFileTypeCounts(fullPath, counts)
      }
    } catch {
      // ignore the error
    }
  }

  return counts
}

program
  .name('how-typed')
  .version(version)
  .description(
    'Calculates and outputs TypeScript metrics for a given directory. It counts the number of JavaScript, TypeScript files, and generates a report with the coverage percentage and color-coded messages.',
  )
  .usage('[directory]')
  .argument(
    '[directory]',
    'The directory to analyse. Defaults to the current working directory.',
    process.cwd(),
  )
  .option('--json', 'Output the report in JSON format', false)

program.parse()

const args = program.processedArgs
const options = program.opts()

const directoryPath = args[0]
const packageJsonPath = path.join(directoryPath, 'package.json')

let packageName = directoryPath

const spinner = ora().start()

try {
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
  packageName = packageJson.name
} catch {
  // package.json does not exist
}

const excludedFilePatterns = await getIgnorePatterns(directoryPath)

spinner.text = `Analyzing Files in '${packageName}' ${packageName !== directoryPath ? `(${directoryPath})` : ''}`
const counts = await summariseDirectoryFilesByType(directoryPath)

spinner.text = 'Calculating TypeScript Percentage'
const countsWithPercentages = calculateScores(counts)
spinner.stop()

outputReport(
  `How-Typed? TypeScript Percentage Report for '${packageName}'`,
  countsWithPercentages,
  options.json,
)
