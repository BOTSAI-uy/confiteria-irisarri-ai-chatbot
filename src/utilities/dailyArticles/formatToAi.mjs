export function formatToAi(dailyArticles) {
  const data = []

  for (const article of dailyArticles) {
    //TODO: agregar mas filtros según necesidad
    // validar stock
    if (article.active) {
      const obj = {
        codigo: article.codigo,
        nombre: article.descripcion,
        descripcion: article.descripcionAvanzada || '',
        alias: article.alias || '',
        catalogo: 'producción diaria',
        familia: article.familia || '',
        grupo: article.grupo || '',
        precio: article.precioVenta || 0,
        unidadMedida: article.unidadMedida || '',
        fotoPortada: article.fotoPortada || '',
        libreDeAzucar: article.libreDeAzucar || false,
        aptoParaCeliacos: article.aptoParaCeliacos || false,
        esVegano: article.esVegano || false,
      }
      // horas de anticipación
      if (article.horasDeAnticipacion) {
        obj.horasDeAnticipacion = `${article.horasDeAnticipacion} horas hábiles`
      }
      // restricciones adicionales
      if (article.restricciones) {
        obj.cantidadMinima = article.cantidadMinima
        obj.multipleDe = article.multipleDe
      }
      data.push(obj)
    }
  }
  return data
}
