//SS MODELOS
import { TemplatesAppsheet } from '#services/appsheet/templates.mjs'

export class TemplatesDb {
  //ss Método para obtener el proveedor actual
  static getProvider() {
    return new TemplatesAppsheet()
  }
}
