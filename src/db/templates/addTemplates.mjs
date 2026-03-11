import catchError from '#utilities/catchError.mjs'
import { TemplatesDb } from './data.mjs'

export async function addTemplates(templates) {
  // obtener datos desde la base de datos
  const db = TemplatesDb.getProvider()
  const [error, result] = await catchError(db.addTemplates(templates))

  // manejar error
  if (error) {
    console.error(`Error al agregar las plantillas: ${error.message}`)
    return []
  }
  console.info(`Plantillas agregadas a la base de datos: ${result.length} plantillas`)

  return result
}
