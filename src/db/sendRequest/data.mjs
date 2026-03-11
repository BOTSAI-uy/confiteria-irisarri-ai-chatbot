//SS MODELOS
import { SendRequestAppsheet } from '#services/appsheet/sendRequest.mjs'

export class SendRequestDb {
  //ss Método para obtener el proveedor actual
  static getProvider() {
    return new SendRequestAppsheet()
  }
}
