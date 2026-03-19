const FORMAT = {
  598: { slice: 3, length: 11, newExtension: '0' }, // Uruguay
  57: { slice: 2, length: 12 }, // Colombia
  521: { slice: 3, length: 13 }, // México
}

export function deletePhoneExtension(phone) {
  // Limpia el número, eliminando caracteres no numéricos
  let cleanedNumber = String(phone).replaceAll(/\D+/g, '')

  // eliminar extension
  for (const [countryCode, { slice, newExtension }] of Object.entries(FORMAT)) {
    if (cleanedNumber.startsWith(countryCode) && cleanedNumber.length === FORMAT[countryCode]?.length) {
      cleanedNumber = cleanedNumber.slice(slice)
      if (newExtension) {
        cleanedNumber = newExtension + cleanedNumber
      }
      return cleanedNumber
    }
  }

  return cleanedNumber
}
