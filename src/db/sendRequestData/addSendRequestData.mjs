import catchError from '#utilities/catchError.mjs'
import { SendRequestDataDb } from './data.mjs'

export async function addSendRequestData(data) {
  // obtener datos desde la base de datos
  const db = SendRequestDataDb.getProvider()
  const [error, template] = await catchError(db.addSendRequestData(data))

  // manejar error
  if (error) {
    console.warn(
      { error: error.message, stack: error.stack },
      `Error al agregar los datos de solicitud en la base de datos`,
    )
    return null
  }
  console.info(`Datos de solicitud agregados en la base de datos`)

  return template
}
