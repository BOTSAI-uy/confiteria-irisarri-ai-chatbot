import { getArticlesFilters } from '#db/articles/getArticlesFilters.mjs'
import { getDailyArticlesFilters } from '#db/dailyArticles/getDailyArticlesFilters.mjs'

export const functionName = 'getArticles'

export async function getJson() {
  const { family, group } = await getArticlesFilters()
  const { familyD, groupD } = await getDailyArticlesFilters()

  const combinedFamily = Array.from(new Set([...(family || []), ...(familyD || [])]))
  const combinedGroup = Array.from(new Set([...(group || []), ...(groupD || [])]))

  const jsonData = {
    type: 'function',
    name: functionName,
    description: 'Obtiene artículos disponibles  con filtros opcionales: familia, grupo o palabra clave.',
    parameters: {
      type: 'object',
      properties: {
        family: {
          type: ['string', 'null'],
          enum: combinedFamily || [''],
          description: 'Filtrar artículos por familia',
        },
        group: {
          type: ['string', 'null'],
          enum: combinedGroup || [''],
          description: 'Filtrar artículos por grupo',
        },
        word: {
          type: ['string', 'null'],
          description: 'Filtrar artículos por palabra clave',
        },
      },
      required: ['family', 'group', 'word'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonData
}
