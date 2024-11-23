import * as ratings from '../ratings.js'

describe('utils', () => {
  describe('getRating()', () => {
    it.each([
      [95, 'Excellent', '🚀'],
      [85, 'Great', '🎉'],
      [65, 'Good', '👍'],
      [55, 'Fair', '🤏'],
      [35, 'Needs Improvement', '😕'],
      [25, 'Poor', '😞'],
    ])(
      "for %s, it should return '%s %s' formatted",
      (percentage, expectedRating, expectedEmoji) => {
        const result = ratings.getRating(percentage)
        expect(result).toEqual(
          expect.objectContaining({
            label: expectedRating,
            emoji: expectedEmoji,
          }),
        )
      },
    )
  })
})
