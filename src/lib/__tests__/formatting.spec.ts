import * as formatting from '../formatting.js'
import type { FormattingColours } from '../../@types/index.js'
import type { Rating } from '../ratings.js'

describe('formatting', () => {
  describe('formatString()', () => {
    it.each([
      [
        'moo',
        'green' as FormattingColours,
        'bgGreen' as FormattingColours,
        true,
        '',
        '',
      ],
      [
        'baa',
        'green' as FormattingColours,
        'bgGreen' as FormattingColours,
        true,
        'prefix',
        '',
      ],
      [
        'woof',
        'yellowGreen' as FormattingColours,
        'bgYellowGreen' as FormattingColours,
        true,
        '',
        'suffix',
      ],
      [
        'meow',
        'yellowGreen' as FormattingColours,
        'bgYellowGreen' as FormattingColours,
        true,
        'prefix',
        'suffix',
      ],
      [
        'roar',
        'yellowGreen' as FormattingColours,
        'bgYellowGreen' as FormattingColours,
        true,
        undefined,
        undefined,
      ],
    ])(
      "should return '%s' formatted",
      (
        string,
        fgColour: FormattingColours,
        bgColour: FormattingColours,
        isBold,
        prefix,
        suffix,
      ) => {
        const result = formatting.formatString(
          string,
          fgColour,
          bgColour,
          isBold,
          prefix,
          suffix,
        )
        expect(result).toMatchSnapshot()
      },
    )
  })

  describe('formatPercentageString()', () => {
    it.each([
      [95.5, '95.50%'],
      [85.25, '85.25%'],
      [65.75, '65.75%'],
      [55.5, '55.50%'],
      [35.1, '35.10%'],
      [25.99, '25.99%'],
    ])('for %s, it should return %s formatted', (percentage, expected) => {
      const result = formatting.formatPercentageString(percentage)
      expect(result).toContain(expected)
      expect(result).toMatchSnapshot()
    })
  })

  describe('formatRating()', () => {
    it.each([
      {
        threshold: 90,
        label: 'Excellent',
        fg: 'green',
        bg: 'bgGreen',
        emoji: '🚀',
      } as Rating,
      {
        threshold: 75,
        label: 'Great',
        fg: 'yellowGreen',
        bg: 'bgYellowGreen',
        emoji: '🎉',
      } as Rating,
      {
        threshold: 60,
        label: 'Good',
        fg: 'yellow',
        bg: 'bgYellow',
        emoji: '👍',
      } as Rating,
      {
        threshold: 50,
        label: 'Fair',
        fg: 'orange',
        bg: 'bgOrange',
        emoji: '🤏',
      } as Rating,
      {
        threshold: 30,
        label: 'Needs Improvement',
        fg: 'orangeRed',
        bg: 'bgOrangeRed',
        emoji: '😕',
      } as Rating,
      {
        threshold: 0,
        label: 'Poor',
        fg: 'red',
        bg: 'bgRed',
        emoji: '😞',
      } as Rating,
    ])(
      'for $label, it should return $label $emoji formatted',
      (rating: Rating) => {
        const result = formatting.formatRating(rating)
        expect(result).toContain(rating.label)
        expect(result).toContain(rating.emoji)
        expect(result).toMatchSnapshot()
      },
    )
  })
})
