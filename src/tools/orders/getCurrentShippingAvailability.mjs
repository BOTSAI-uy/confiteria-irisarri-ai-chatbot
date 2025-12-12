import { getDailyArticleByCode } from '#db/dailyArticles/getDailyArticleByCode.mjs'
import { getShippingAvailability } from '#tools/orders/getShippingAvailability.mjs'

export async function getCurrentShippingAvailability(articleCodes = []) {
  let anticipationHours = 0
  for (const code of articleCodes) {
    const dailyArticle = await getDailyArticleByCode(code)
    if (dailyArticle) {
      if (dailyArticle.anticipationHours > anticipationHours) {
        anticipationHours = dailyArticle.anticipationHours
      }
    }
  }

  const shippingAvailability = await getShippingAvailability(anticipationHours)

  if (!shippingAvailability) {
    console.error('getCurrentShippingAvailability: No se pudo obtener la disponibilidad de envío.')
    return null
  }

  if (shippingAvailability.length === 0) {
    console.error('getCurrentShippingAvailability: La disponibilidad de envío está vacía.')
    return null
  }

  let date
  let time

  // obtener primera hora y fecha disponible
  for (const day of shippingAvailability) {
    if (day.times && day.times.length > 0) {
      date = day.date
      time = day.times[0]
      break
    }
  }

  // dar formato a la fecha y hora
  if (date && time) {
    // eliminar los ultimos dos caracteres de time (:ss)
    const formattedTime = time.length === 5 ? time : time.slice(0, -3)
    const dateTimeString = `${date} ${formattedTime}`
    return dateTimeString
  } else {
    console.error('getCurrentShippingAvailability: No se encontró una fecha y hora disponible.')
    return null
  }
}
