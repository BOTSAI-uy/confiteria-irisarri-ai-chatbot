import catchError from '#utilities/catchError.mjs'
import { SendRequestTagsDb } from './data.mjs'

export async function getSendRequestTagById(id) {
  // obtener datos desde la base de datos
  const db = SendRequestTagsDb.getProvider()
  const [error, template] = await catchError(db.getSendRequestTagById(id))

  // manejar error
  if (error) {
    console.warn(
      { error: error.message, stack: error.stack },
      `Error al obtener las etiquetas de solicitud desde la base de datos para id ${id}`,
    )
    return []
  }
  console.info(`Etiquetas de solicitud obtenidas de la base de datos para id ${id}`)

  return template
}
