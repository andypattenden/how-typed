import type { MockInstance } from 'vitest'
import * as output from '../output.js'

vi.stubGlobal('console', { log: vi.fn() })

describe('output', () => {
  let log: MockInstance<typeof console.log>

  beforeEach(() => {
    log = vi.mocked(console.log)
    log.mockReset()
  })

  describe('outputHeader', () => {
    it.each([['Title'], ['Another Title'], ['A title with an odd length!']])(
      'should output a header with %s',
      (title) => {
        output.outputHeader(title)

        log.mock.calls.forEach((call) => {
          expect(call).toMatchSnapshot()
        })
      },
    )
  })

  describe('outputSubheader', () => {
    it('should output a subheader', () => {
      output.outputSubheader('Subheader')

      log.mock.calls.forEach((call) => {
        expect(call).toMatchSnapshot()
      })
    })
  })

  describe('outputReportSummary', () => {
    it('should output a report summary', () => {
      output.outputReportSummary({
        percentages: {
          files: {
            ts: 60,
            js: 40,
          },
          loc: {
            ts: 60,
            js: 40,
          },
        },
        total: {
          files: 26,
          loc: 1000,
        },
        score: 59.31,
        filetypes: {
          plain: {
            label: 'Plain JS/TS',
            js: {
              files: 4,
              loc: 6,
            },
            ts: {
              files: 6,
              loc: 8,
            },
            total: {
              files: 10,
              loc: 14,
            },
            percentages: {
              files: {
                ts: 60,
                js: 40,
              },
              loc: {
                ts: 70,
                js: 30,
              },
            },
            score: 67,
          },
          vue: {
            label: 'Vue SFC',
            js: {
              files: 7,
              loc: 12,
            },
            ts: {
              files: 9,
              loc: 16,
            },
            total: {
              files: 16,
              loc: 28,
            },
            percentages: {
              files: {
                ts: 56.25,
                js: 43.75,
              },
              loc: {
                ts: 75,
                js: 25,
              },
            },
            score: 69.38,
          },
        },
      })

      log.mock.calls.forEach((call) => {
        expect(call).toMatchSnapshot()
      })
    })
  })

  describe('outputReport', () => {
    it('should output a report', () => {
      output.outputReport('Title', {
        total: {
          files: 26,
          loc: 1000,
        },
        percentages: {
          files: {
            ts: 57.69,
            js: 42.31,
          },
          loc: {
            ts: 60,
            js: 40,
          },
        },
        score: 59.31,
        filetypes: {
          plain: {
            label: 'Plain JS/TS',
            js: {
              files: 4,
              loc: 6,
            },
            ts: {
              files: 6,
              loc: 8,
            },
            total: {
              files: 10,
              loc: 14,
            },
            percentages: {
              files: {
                ts: 60,
                js: 40,
              },
              loc: {
                ts: 70,
                js: 30,
              },
            },
            score: 67,
          },
          vue: {
            label: 'Vue SFC',
            js: {
              files: 7,
              loc: 12,
            },
            ts: {
              files: 9,
              loc: 16,
            },
            total: {
              files: 16,
              loc: 28,
            },
            percentages: {
              files: {
                ts: 56.25,
                js: 43.75,
              },
              loc: {
                ts: 75,
                js: 25,
              },
            },
            score: 69.38,
          },
        },
      })

      log.mock.calls.forEach((call) => {
        expect(call).toMatchSnapshot()
      })
    })

    it('should output a report with no files found', () => {
      output.outputReport('Title', {
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

      log.mock.calls.forEach((call) => {
        expect(call).toMatchSnapshot()
      })
    })
  })
})
