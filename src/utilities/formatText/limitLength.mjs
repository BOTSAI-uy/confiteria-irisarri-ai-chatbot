export function limitLength(text, maxLength, tail = '...') {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - tail.length) + tail
  }
  return text
}
