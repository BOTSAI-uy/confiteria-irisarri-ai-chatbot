import { getArticlesByFilter } from '#db/articles/getArticlesByFilter.mjs'
import { findArticlesByWord } from '#db/articles/findArticlesByWord.mjs'
import { getDailyArticlesByFilter } from '#db/dailyArticles/getDailyArticlesByFilter.mjs'
import { findDailyArticlesByWord } from '#db/dailyArticles/findDailyArticlesByWord.mjs'
import { formatToAi } from '#utilities/articles/formatToAi.mjs'
import { formatToAi as formatToAiDaily } from '#utilities/dailyArticles/formatToAi.mjs'

export async function getArticles(args, user, userIdKey) {
  const { family, group, word } = args

  if (!family && !group && !word) {
    console.error('getArticles: Al menos un filtro debe ser proporcionado')
    return { error: 'Al menos un filtro debe ser proporcionado' }
  }

  // Usar un Set para evitar artículos duplicados
  const articlesSet = new Set()
  const dailyArticlesSet = new Set()

  //TODO: Agregar función para actualizar cache con la función getUpdatedArticles()

  // filtrar por familia
  if (family) {
    const articlesByFamily = await getArticlesByFilter('familia', family)
    if (articlesByFamily) {
      articlesByFamily.forEach((article) => articlesSet.add(article))
    }
    const dailyArticlesByFamily = await getDailyArticlesByFilter('familia', family)
    if (dailyArticlesByFamily) {
      dailyArticlesByFamily.forEach((article) => dailyArticlesSet.add(article))
    }
  }

  // filtrar por grupo
  if (group) {
    const articlesByGroup = await getArticlesByFilter('grupo', group)
    if (articlesByGroup) {
      articlesByGroup.forEach((article) => articlesSet.add(article))
    }
    const dailyArticlesByGroup = await getDailyArticlesByFilter('grupo', group)
    if (dailyArticlesByGroup) {
      dailyArticlesByGroup.forEach((article) => dailyArticlesSet.add(article))
    }
  }

  // filtrar por palabra clave
  if (word) {
    const articlesByWord = await findArticlesByWord(word)
    if (articlesByWord) {
      articlesByWord.forEach((article) => articlesSet.add(article))
    }
    const dailyArticlesByWord = await findDailyArticlesByWord(word)
    if (dailyArticlesByWord) {
      dailyArticlesByWord.forEach((article) => dailyArticlesSet.add(article))
    }
  }

  // Convertir el Set de nuevo a un array
  const articles = Array.from(articlesSet)
  // Formatear los artículos para la respuesta de la IA
  const formattedArticles = formatToAi(articles)

  // Convertir el Set de nuevo a un array
  const dailyArticles = Array.from(dailyArticlesSet)
  // Formatear los artículos para la respuesta de la IA
  const formattedDailyArticles = formatToAiDaily(dailyArticles)

  // Combinar ambos tipos de artículos
  const allFormattedArticles = [...formattedDailyArticles, ...formattedArticles]

  console.info(
    `🧩 Respuesta de función <getArticles>: Se encontraron ${formattedArticles.length} artículos normales y ${formattedDailyArticles.length} artículos de producción diaria con los filtros proporcionados.`
  )
  return allFormattedArticles
}
