import pkg from 'papaparse'

import fs from 'fs'

import { DailyArticlesAppsheet } from '#services/appsheet/dailyArticles.mjs'
import { ArticlesAppsheet } from '#services/appsheet/articles.mjs'
import { ArticlesFacturapp } from '#services/facturapp/articles.mjs'

const { unparse } = pkg
/*
const schema = {
  codigo: 'string',
  descripcion: 'string',
  descripcionAvanzada: 'string',
  enAppsheet: 'boolean',
  enFacturapp: 'boolean',
  enAppsheetDaily: 'boolean',
}
*/

export async function articlesSummary() {
  // cargar todos los artículos diarios desde AppSheet
  const dailyArticles = await DailyArticlesAppsheet.getAllDailyArticles()
  console.log(`Total daily articles fetched: ${dailyArticles.length}`)

  // cargar todos los artículos desde AppSheet
  const articles = await ArticlesAppsheet.getAllArticles()
  console.log(`Total articles fetched: ${articles.length}`)

  // cargar todos los artículos desde Facturapp
  const facturappArticles = await ArticlesFacturapp.getAllArticles()
  console.log(`Total facturapp articles fetched: ${facturappArticles.length}`)

  // crear un resumen comparativo de los artículos en formato CSV
  const allCodes = new Set()

  // Recopilar todos los códigos únicos
  dailyArticles.forEach((article) => allCodes.add(article.codigo))
  articles.forEach((article) => allCodes.add(article.codigo))
  facturappArticles.forEach((article) => allCodes.add(article.codigo))

  // Crear el resumen comparativo
  const summary = Array.from(allCodes).map((codigo) => {
    const dailyArticle = dailyArticles.find((a) => a.codigo === codigo)
    const article = articles.find((a) => a.codigo === codigo)
    const facturappArticle = facturappArticles.find((a) => a.codigo === codigo)

    return {
      codigo,
      descripcion: facturappArticle?.descripcion || article?.descripcion || dailyArticle?.descripcion || '',
      descripcionAvanzada: facturappArticle?.descripcionAvanzada || article?.descripcionAvanzada || '',
      enAppsheet: !!article,
      enFacturapp: !!facturappArticle,
      enAppsheetDaily: !!dailyArticle,
    }
  })

  // Convertir a CSV
  const csv = unparse(summary)

  // Guardar el archivo CSV
  const outputPath = './temp/articles-summary.csv'
  fs.writeFileSync(outputPath, csv, 'utf-8')

  console.log(`\nResumen generado exitosamente en: ${outputPath}`)
  console.log(`Total de artículos únicos: ${summary.length}`)
  console.log(`Artículos en AppSheet: ${summary.filter((a) => a.enAppsheet).length}`)
  console.log(`Artículos en Facturapp: ${summary.filter((a) => a.enFacturapp).length}`)
  console.log(`Artículos en AppSheet Daily: ${summary.filter((a) => a.enAppsheetDaily).length}`)

  return summary
}
