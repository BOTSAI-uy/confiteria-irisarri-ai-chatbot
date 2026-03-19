import { getAllArticles } from '#db/articles/getAllArticles.mjs'

const WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export async function applyDiscounts(order, discounts) {
  // validar que existan descuentos activos
  if (!discounts || discounts.length === 0) return order

  const today = new Date()
  const currentDay = WEEK_DAYS[today.getDay()]

  const articlesData = await getAllArticles()

  for (const article of order.articles) {
    // buscar información del artículo para aplicar descuentos
    const articleInfo = articlesData.find((a) => a.codigo === article.article)
    if (!articleInfo) {
      console.warn(`Artículo no encontrado para código ${article.article}, omitiendo descuentos.`)
    }

    // buscar descuentos aplicables al artículo
    const discount = discounts.find((d) => d.groupId === articleInfo.idGrupo && d.days.includes(currentDay))
    if (discount) {
      console.info(
        `Aplicando descuento del ${discount.discount * 100}% al artículo ${articleInfo.descripcion} el dia ${currentDay} (código ${article.article})`,
      )
      // aplicar descuento al artículo
      article.discount = discount.discount

      // agregar nota al artículo sobre el descuento aplicado
      article.note = article.note
        ? `${article.note}\nDescuento aplicado [${discount.name}]: ${discount.discount * 100}%`
        : `Descuento aplicado [${discount.name}]: ${discount.discount * 100}%`
    }
  }

  return order
}
