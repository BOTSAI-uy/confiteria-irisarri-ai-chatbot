import { OrdersConfigDb } from './data.mjs'

export async function getOrderConfig() {
  try {
    // obtener datos desde la base de datos
    const config = await OrdersConfigDb.getOrderConfig()
    console.info('Configuración de orden obtenida de la base de datos')

    // almacenar en caché
    return config
  } catch (error) {
    console.error('getBrainById: Error al obtener el brain por ID:', error.message)
    return null
  }
}
