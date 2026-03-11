//SS MODELOS
import { SendRequestTagsAppsheet } from '#services/appsheet/sendRequestTags.mjs'

export class SendRequestTagsDb {
  //ss Método para obtener el proveedor actual
  static getProvider() {
    return new SendRequestTagsAppsheet()
  }
}
