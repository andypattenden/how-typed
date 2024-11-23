import fs from 'fs/promises'
import type { Counts } from '../../@types/index.js'
import * as utils from '../utils.js'

vi.mock('fs/promises', async () => ({
  default: {
    readFile: vi.fn(),
  },
}))

describe('utils', () => {
  let counts: Counts

  beforeEach(() => {
    counts = {
      total: {
        files: 26,
        loc: 487,
      },
      percentages: {
        files: {
          ts: 57.69,
          js: 42.31,
        },
        loc: {
          ts: 77.41,
          js: 22.59,
        },
      },
      score: 71.49,
      filetypes: {
        plain: {
          label: 'Plain JS/TS',
          js: {
            files: 4,
            loc: 32,
          },
          ts: {
            files: 6,
            loc: 254,
          },
          total: {
            files: 10,
            loc: 286,
          },
          percentages: {
            files: {
              ts: 60.0,
              js: 40.0,
            },
            loc: {
              ts: 88.81,
              js: 11.19,
            },
          },
          score: 80.17,
        },
        vue: {
          label: 'Vue SFC',
          js: {
            files: 7,
            loc: 78,
          },
          ts: {
            files: 9,
            loc: 123,
          },
          total: {
            files: 16,
            loc: 201,
          },
          percentages: {
            files: {
              ts: 56.25,
              js: 43.75,
            },
            loc: {
              ts: 61.19,
              js: 38.81,
            },
          },
          score: 59.71,
        },
      },
    }
  })

  describe('calculatePercentage()', () => {
    it.each([
      [10, 100, 10.0],
      [23, 57, 40.35],
      [33, 100, 33.0],
      [47, 94, 50.0],
      [50, 200, 25.0],
      [67, 89, 75.28],
      [75, 150, 50.0],
      [82, 164, 50.0],
      [90, 180, 50.0],
      [100, 250, 40.0],
      [33, 99, 33.33],
      [25, 75, 33.33],
      [50, 150, 33.33],
    ])('for %s and %s, it should return %s', (value, total, expected) => {
      const result = utils.calculatePercentage(value, total)
      expect(result).toBe(expected)
    })
  })

  describe('calculateScores()', () => {
    it('should calculate the percentages', () => {
      const result = utils.calculateScores(counts)
      expect(result).toEqual({
        total: {
          files: 26,
          loc: 487,
        },
        percentages: {
          files: {
            ts: 57.69,
            js: 42.31,
          },
          loc: {
            ts: 77.41,
            js: 22.59,
          },
        },
        score: 71.49,
        filetypes: {
          plain: {
            label: 'Plain JS/TS',
            js: {
              files: 4,
              loc: 32,
            },
            ts: {
              files: 6,
              loc: 254,
            },
            total: {
              files: 10,
              loc: 286,
            },
            percentages: {
              files: {
                ts: 60.0,
                js: 40.0,
              },
              loc: {
                ts: 88.81,
                js: 11.19,
              },
            },
            score: 80.17,
          },
          vue: {
            label: 'Vue SFC',
            js: {
              files: 7,
              loc: 78,
            },
            ts: {
              files: 9,
              loc: 123,
            },
            total: {
              files: 16,
              loc: 201,
            },
            percentages: {
              files: {
                ts: 56.25,
                js: 43.75,
              },
              loc: {
                ts: 61.19,
                js: 38.81,
              },
            },
            score: 59.71,
          },
        },
      })
    })
  })

  describe('getIgnorePatterns()', () => {
    it('should return the default ignore patterns when no .gitignore file is present', async () => {
      vi.mocked(fs.readFile).mockRejectedValueOnce(
        new Error('ENOENT: no such file or directory'),
      )

      const result = await utils.getIgnorePatterns('')
      expect(result).toEqual([
        '**/node_modules',
        '**/dist',
        '**/build',
        '**/.*',
      ])
    })

    it('should return the correct ignore patterns when a .gitignore file is present', async () => {
      vi.mocked(fs.readFile).mockResolvedValueOnce(
        `
        node_modules/
        dist/
        build/
        .git/
        out/
        public/
        # Comment
        coverage/
        test/
        tests/
        __tests__/
        __mocks__/
        mocks/
        docs/
        doc/
        tmp/
        temp/
      `,
      )
      const result = await utils.getIgnorePatterns('')
      expect(result).toEqual([
        '**/node_modules',
        '**/dist',
        '**/build',
        '**/.*',
        'node_modules/',
        'dist/',
        'build/',
        '.git/',
        'out/',
        'public/',
        'coverage/',
        'test/',
        'tests/',
        '__tests__/',
        '__mocks__/',
        'mocks/',
        'docs/',
        'doc/',
        'tmp/',
        'temp/',
      ])
    })
  })

  describe('isFileIgnored()', () => {
    it('should return true if the file is ignored', () => {
      const result = utils.isFileIgnored('node_modules', ['**/node_modules'])
      expect(result).toBe(true)
    })

    it('should return false if the file is not ignored', () => {
      const result = utils.isFileIgnored('src/index.js', ['**/node_modules'])
      expect(result).toBe(false)
    })
  })

  describe('getTotalsCountForFiletype()', () => {
    it('should return the total counts for the given filetype', () => {
      const jsResult = utils.getTotalsCountForFiletype(counts, 'js')
      expect(jsResult).toEqual({
        files: 11,
        loc: 110,
      })

      const tsResult = utils.getTotalsCountForFiletype(counts, 'ts')
      expect(tsResult).toEqual({
        files: 15,
        loc: 377,
      })
    })
  })

  describe('incrementFileTypeCounts()', () => {
    const copyCountsObject = (counts: Counts) =>
      JSON.parse(JSON.stringify(counts))

    it('should increment the filetype count based on the file type', async () => {
      const counts: Counts = {
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
        filetypes: {
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
          },
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
          },
        },
      }

      const filePath = 'test.vue'
      const vueNoScriptContent = `<template></template><style></style>`
      vi.mocked(fs.readFile).mockResolvedValueOnce(vueNoScriptContent)
      const countsResult = await utils.incrementFileTypeCounts(
        filePath,
        copyCountsObject(counts),
      )
      expect(countsResult).toEqual({
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
        filetypes: {
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
          },
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
          },
        },
      })

      const vueFilePath = 'test.vue'
      const vueContent = `<template></template><script>console.log("Hello, world!")</script><style></style>`
      vi.mocked(fs.readFile).mockResolvedValueOnce(vueContent)
      const vueCountsResult = await utils.incrementFileTypeCounts(
        vueFilePath,
        copyCountsObject(counts),
      )
      expect(vueCountsResult).toEqual({
        total: {
          files: 1,
          loc: 1,
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
        filetypes: {
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
          },
          vue: {
            label: 'Vue SFC',
            js: {
              files: 1,
              loc: 1,
            },
            ts: {
              files: 0,
              loc: 0,
            },
            total: {
              files: 1,
              loc: 1,
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
          },
        },
      })

      const jsFilePath = 'test.js'
      vi.mocked(fs.readFile).mockResolvedValueOnce(
        'console.log("Hello, world!")',
      )
      const jsCountsResult = await utils.incrementFileTypeCounts(
        jsFilePath,
        copyCountsObject(counts),
      )
      expect(jsCountsResult).toEqual({
        total: {
          files: 1,
          loc: 1,
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
        filetypes: {
          plain: {
            label: 'Plain JS/TS',
            js: {
              files: 1,
              loc: 1,
            },
            ts: {
              files: 0,
              loc: 0,
            },
            total: {
              files: 1,
              loc: 1,
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
          },
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
          },
        },
      })

      const tsFilePath = 'test.ts'
      vi.mocked(fs.readFile).mockResolvedValueOnce(
        'console.log("Hello, world!")',
      )
      const tsCountsResult = await utils.incrementFileTypeCounts(
        tsFilePath,
        copyCountsObject(counts),
      )
      expect(tsCountsResult).toEqual({
        total: {
          files: 1,
          loc: 1,
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
        filetypes: {
          plain: {
            label: 'Plain JS/TS',
            js: {
              files: 0,
              loc: 0,
            },
            ts: {
              files: 1,
              loc: 1,
            },
            total: {
              files: 1,
              loc: 1,
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
          },
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
          },
        },
      })
    })

    it('should not increment the counts object if the file extension is not supported', async () => {
      const filePath = 'test.txt'
      const counts: Counts = {
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
        filetypes: {
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
          },
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
          },
        },
      }

      const result = await utils.incrementFileTypeCounts(filePath, counts)
      expect(result).toEqual(counts)
    })
  })

  describe('countLinesOfCode()', () => {
    it('should count the lines of code in a string', () => {
      const result = utils.countLinesOfCode(
        `console.log('Hello, world!')
        console.log('Hello, world!')
        console.log('Hello, world!')
        console.log('Hello, world!')
        console.log('Hello, world!')`,
      )
      expect(result).toBe(5)
    })

    it('should return 0 if the string is empty', () => {
      const result = utils.countLinesOfCode('')
      expect(result).toBe(0)
    })

    it('should return 0 if the string is only whitespace', () => {
      const result = utils.countLinesOfCode('    ')
      expect(result).toBe(0)
    })

    it('should return 0 if the string is only newlines', () => {
      const result = utils.countLinesOfCode('\n\n\n\n\n')
      expect(result).toBe(0)
    })

    it('should return 1 if the string is a single line of code', () => {
      const result = utils.countLinesOfCode('console.log("Hello, world!")')
      expect(result).toBe(1)
    })

    it('should return 1 if the string is a single line of code with a newline', () => {
      const result = utils.countLinesOfCode('console.log("Hello, world!")\n')
      expect(result).toBe(1)
    })

    it('should return 6 if there are comments and empty lines', () => {
      const result = utils.countLinesOfCode(
        `// Comment
        // Comment
        console.log('Hello, world!')
        // Comment
        console.log('Hello, world!')
        /* Comment */
        console.log('Hello, world!')


        /**
         * Comment
         * Comment
         */
        console.log('Hello, world!')
        /*
        Comment */
        console.log('Hello, world!')
        /*
        * Comment
        */
        console.log('Hello, world!')
        `,
      )
      expect(result).toBe(6)
    })
  })

  describe('calculateScore()', () => {
    it('should calculate the score based on the percentages', () => {
      const result = utils.calculateScore(50, 50)
      expect(result).toBe(50)

      const result2 = utils.calculateScore(25, 75)
      expect(result2).toBe(60)

      const result3 = utils.calculateScore(75, 25)
      expect(result3).toBe(40)
    })
  })
})
