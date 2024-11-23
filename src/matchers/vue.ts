/**
 * Checks the type of script used in a Vue Single File Component (SFC)
 */
export async function getVueSfcScriptType(content: string) {
  const tsPattern = /<script\s+(setup\s+)?lang="ts"/
  const jsPattern = /<script(?![^>]*\blang="ts")[^>]*>/

  if (tsPattern.test(content)) {
    return 'ts'
  } else if (jsPattern.test(content)) {
    return 'js'
  }

  return null // it's a Vue SFC but without a script block
}
