export async function validateBaseArticle(item, dailyArticle, result) {
  // validar que la cantidad no exceda el stock disponible
  if (item.quantity > dailyArticle.stockActual) {
    console.warn(
      `validateBaseArticle: La cantidad del artículo con código ${item.article} excede el stock disponible de ${dailyArticle.stockActual}.`
    )
    result.errors.push(`La cantidad del artículo con código ${item.article} excede el stock disponible`)
  }
}
