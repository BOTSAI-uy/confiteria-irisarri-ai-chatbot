async function catchError(Promise) {
  try {
    const data = await Promise
    return [null, data]
  } catch (error) {
    return [error, null]
  }
}

export default catchError
