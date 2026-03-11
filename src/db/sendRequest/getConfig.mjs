import catchError from '#utilities/catchError.mjs'
import { SendRequestDb } from './data.mjs'

export async function getConfig() {
  // obtener datos desde la base de datos
  const db = SendRequestDb.getProvider()
  const [error, template] = await catchError(db.getConfig())

  // manejar error
  if (error) {
    console.warn({ error: error.message, stack: error.stack }, `Error al obtener la configuración de solicitudes`)
    return null
  }
  console.trace(`Configuración de solicitudes obtenida de la base de datos`)

  return template
}
