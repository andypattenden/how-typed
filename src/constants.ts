export const fileTypeExtensions = {
  js: ['.js', '.mjs', '.cjs', '.jsx'],
  ts: ['.ts', '.tsx'],
  vue: ['.vue'],
}

export const allFileExtensions = [
  ...fileTypeExtensions.js,
  ...fileTypeExtensions.ts,
  ...fileTypeExtensions.vue,
]

export const headingColours = {
  fg: 'white',
  bg: 'bgBlackBright',
} as const

export const subHeadingColours = {
  fg: 'blue',
} as const

export const formattingColours = {
  green: '#00FF00',
  yellowGreen: '#ADFF2F',
  yellow: '#FFFF00',
  orange: '#FFA500',
  orangeRed: '#FF4500',
  red: '#FF0000',
  black: '#000000',
  bgGreen: '#003300',
  white: '#FFFFFF',
  bgBlack: '#000000',
  bgYellowGreen: '#334d00',
  bgYellow: '#333300',
  bgOrange: '#331a00',
  bgOrangeRed: '#330d00',
  bgRed: '#330000',
  tsLogo: '#3178c6',
  jsLogo: '#F0DB4F',
} as const

export const defaultExcludedFilePatterns = [
  '**/node_modules',
  '**/dist',
  '**/build',
  '**/.*',
]

export const locWeighting = 0.7
export const fileWeighting = 0.3
