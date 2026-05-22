import { getAllDailyArticles } from '#db/dailyArticles/getAllDailyArticles.mjs'

export async function buildAliasArticles() {
  const dailyArticles = await getAllDailyArticles()
  if (!dailyArticles || dailyArticles.length === 0) {
    console.warn(`No se han encontrado artículos diarios para construir alias.`)
    return ''
  }

  // filtrar los que tengan alias, activos y que se agreguen al prompt
  const articles = dailyArticles.filter((a) => a.alias && a.active && a.addPrompt)
  console.log('cantidad de articulos con alias:', articles.length)

  let text = '## Articulos frecuentemente pedidos por los clientes:\n\n'

  for (const article of articles) {
    text += `### ${article.descripcion} (codigo: ${article.codigo})\n\n`

    text += `**familia:** ${article.familia}\n`
    text += `**grupo:** ${article.grupo}\n`
    text += `**unidad:** ${article.unidadMedida}\n`
    text += `**precio:** ${article.precioVenta}\n`

    if (article.alias) {
      text += `**alias (palabras frecuentes):** ${article.alias}\n`
    }

    if (article.restricciones) {
      text += `**cantidad minima:** ${article.cantidadMinima}\n`
      text += `**multiplos de:** ${article.multipleDe}\n`
    }
    if (article.horasDeAnticipacion) {
      text += `**horas de anticipacion:** ${article.horasDeAnticipacion}\n`
    }

    text += `**libre de azucar:** ${article.libreDeAzucar ? 'SI' : 'NO'}\n`
    text += `**apto para celiacos:** ${article.aptoParaCeliacos ? 'SI' : 'NO'}\n`
    text += `**es vegano:** ${article.esVegano ? 'SI' : 'NO'}\n`

    text += `\n`
  }

  return text.trim()
}
