import { getShippingAvailability } from '../getShippingAvailability.mjs'

export async function validateDeliveryDate(deliveryDate, result) {
  // Validar que la fecha de entrega es una cadena no vacía
  if (!deliveryDate || typeof deliveryDate !== 'string') {
    console.error('Fecha de entrega inválida o no proporcionada:', deliveryDate)
    result.errors.push('La fecha de entrega es obligatoria y debe ser una cadena de texto.')
    return
  }

  // validar formato AAAA-MM-DD HH:MM
  if (!isValidDateTime(deliveryDate)) {
    console.error('Formato de fecha de entrega inválido:', deliveryDate)
    result.errors.push("El formato de la fecha de entrega debe ser 'AAAA-MM-DD HH:MM'.")
    return
  }

  // validar que la fecha de entrega no sea en el pasado
  const now = new Date()
  const delivery = new Date(deliveryDate)
  if (delivery < now) {
    console.error('Fecha de entrega en el pasado:', deliveryDate)
    result.errors.push('La fecha de entrega no puede ser en el pasado.')
    return
  }

  // Validar que la fecha de entrega está dentro de las opciones disponibles
  const availableDates = await getShippingAvailability(result.anticipationHours)

  // buscar si la fecha de entrega está en las opciones disponibles
  let isAvailable = false
  const [datePart, timePart] = deliveryDate.split(' ')
  for (const dayAvailability of availableDates) {
    if (dayAvailability.date === datePart) {
      if (dayAvailability.times.includes(`${timePart}:00`)) {
        isAvailable = true
        break
      }
    }
  }

  if (!isAvailable) {
    console.error('Fecha de entrega no disponible:', deliveryDate)
    result.errors.push('La fecha de entrega seleccionada no está disponible.')
  }
}

function isValidDateTime(dateTimeString) {
  // Validar formato exacto con regex
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/
  if (!regex.test(dateTimeString)) return false

  // Separar componentes
  const [datePart, timePart] = dateTimeString.split(' ')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)

  // Validar rangos de fecha y hora
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  if (hour < 0 || hour > 23) return false
  if (minute < 0 || minute > 59) return false

  // Validar existencia real del día (por ejemplo, 30 feb no es válido)
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    return false
  }

  return true
}
