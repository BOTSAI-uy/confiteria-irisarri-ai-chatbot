import catchError from '#utilities/catchError.mjs'
import { DiscountsDb } from './data.mjs'

export async function getAllDiscounts() {
  // obtener datos desde la base de datos
  const db = DiscountsDb.getProvider()
  const [error, discounts] = await catchError(db.getAllDiscounts())

  // manejar error
  if (error) {
    console.warn({ error: error.message, stack: error.stack }, `Error al obtener los descuentos`)
    return []
  }
  console.info(`Descuentos obtenidos de la base de datos`)

  return discounts
}
