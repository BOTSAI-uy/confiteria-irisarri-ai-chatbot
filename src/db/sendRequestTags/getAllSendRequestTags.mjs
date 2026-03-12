import catchError from '#utilities/catchError.mjs'
import { SendRequestTagsDb } from './data.mjs'

export async function getAllSendRequestTags() {
  // obtener datos desde la base de datos
  const db = SendRequestTagsDb.getProvider()
  const [error, template] = await catchError(db.getAllSendRequestTags())

  // manejar error
  if (error) {
    console.warn(
      { error: error.message, stack: error.stack },
      `Error al obtener las etiquetas de solicitud desde la base de datos`,
    )
    return []
  }
  console.info(`Etiquetas de solicitud obtenidas de la base de datos`)

  return template
}
