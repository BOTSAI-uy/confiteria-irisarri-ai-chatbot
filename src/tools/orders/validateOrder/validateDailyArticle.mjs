export async function validateDailyArticle(item, dailyArticle, deliveryDate, result) {
  //console.log('Validating daily article:', { item, dailyArticle, deliveryDate })
  // validar que este disponible
  if (!dailyArticle.active) {
    console.error(`validateDailyArticle: El artículo con código ${item.article} no está disponible para la venta hoy.`)
    result.errors.push(`El artículo con código ${item.article} no está disponible para la venta hoy.`)
  }

  // actualizar horas de anticipación necesarias
  if (dailyArticle.horasDeAnticipacion > 0) {
    result.anticipationHours = Math.max(result.anticipationHours, dailyArticle.horasDeAnticipacion)
  }

  // validar si se debe remitir a humano
  if (dailyArticle.remitirHumano) {
    console.warn(`validateDailyArticle: El artículo con código ${item.article} requiere revisión manual.`)
    result.toHuman = true
  }

  // validar si hay restricciones
  if (dailyArticle.restricciones) {
    // validar cantidad mínima
    if (item.quantity < dailyArticle.cantidadMinima) {
      console.warn(
        `validateDailyArticle: La cantidad del artículo con código ${item.article} es menor a la cantidad mínima permitida de ${dailyArticle.cantidadMinima}.`
      )
      result.errors.push(
        `La cantidad del artículo con código ${item.article} es menor a la cantidad mínima permitida de ${dailyArticle.cantidadMinima}.`
      )
    }

    // validar múltiplo  con una tolerancia para evitar errores de punto flotante
    const multipleOf = dailyArticle.multipleDe
    const tolerance = 0.01
    if (
      Math.abs(item.quantity % multipleOf) > tolerance &&
      Math.abs((item.quantity % multipleOf) - multipleOf) > tolerance
    ) {
      console.warn(
        `validateDailyArticle: La cantidad del artículo con código ${item.article} debe ser un múltiplo de ${multipleOf}.`
      )
      result.errors.push(`La cantidad del artículo con código ${item.article} debe ser un múltiplo de ${multipleOf}.`)
    }
  }
}
