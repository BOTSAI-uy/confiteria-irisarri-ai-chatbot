import catchError from '#utilities/catchError.mjs'
import { TemplatesDb } from './data.mjs'

export async function getTemplateById(id) {
  // obtener datos desde la base de datos
  const db = TemplatesDb.getProvider()
  const [error, template] = await catchError(db.getTemplateById(id))

  // manejar error
  if (error) {
    console.warn({ error: error.message, stack: error.stack }, `Error al obtener la plantilla por ID: ${id}`)
    return null
  }
  console.trace(`Plantilla obtenida de la base de datos: ${id}`)

  return template
}
