//SS MODELOS
import { DiscountAppsheet } from '#services/appsheet/discounts.mjs'

export class DiscountsDb {
  //ss Método para obtener el proveedor actual
  static getProvider() {
    return new DiscountAppsheet()
  }
}
