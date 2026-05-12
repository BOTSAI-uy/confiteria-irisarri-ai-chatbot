export class OrdersCache {
  static cache = new Map()

  static get(orderId) {
    // cargar la orden desde la caché
    const entry = this.cache.get(orderId)
    return entry ? entry.data : null
  }

  static add(orderId, orderData) {
    this.cache.set(orderId, {
      data: orderData,
    })
  }
}
