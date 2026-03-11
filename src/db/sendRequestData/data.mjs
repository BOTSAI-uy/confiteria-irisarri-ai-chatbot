//SS MODELOS
import { SendRequestDataAppsheet } from '#services/appsheet/sendRequestData.mjs'

export class SendRequestDataDb {
  //ss Método para obtener el proveedor actual
  static getProvider() {
    return new SendRequestDataAppsheet()
  }
}
