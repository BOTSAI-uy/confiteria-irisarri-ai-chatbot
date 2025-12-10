import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { OrdersConfigAppsheet } from '#services/appsheet/ordersConfig.mjs'

export class OrdersConfigDb {
  //ss Mapeo de proveedores de base de datos
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: OrdersConfigAppsheet,
  }

  //ss Método para obtener el proveedor actual
  static getProvider() {
    const provider = this.dbProviders[ENV.DB_HOST]
    if (!provider) {
      console.error('Proveedor de base de datos no soportado')
      throw new Error('Proveedor de base de datos no soportado')
    }
    return provider
  }

  //ss cargar brain por id
  static async getOrderConfig() {
    try {
      return await this.getProvider().getOrderConfig()
    } catch (error) {
      console.error('OrdersConfigDb: Error al obtener la configuración de orden por ID:', error.message)
      throw error
    }
  }
}
