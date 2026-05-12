export class OrdersCache {
  static cache = new Map()
  static TTL = 1000 * 60 // 1 minuto

  static get(orderId) {
    // cargar la orden desde la caché
    const entry = this.cache.get(orderId)
    if (!entry) return null

    // verificar si la entrada ha expirado
    const isExpired = Date.now() - entry.timestamp > this.TTL
    if (isExpired) {
      this.cache.delete(orderId)
      return null
    }

    return entry.data
  }

  static add(orderId, orderData) {
    this.cache.set(orderId, {
      data: orderData,
      timestamp: Date.now(),
    })
  }
}
