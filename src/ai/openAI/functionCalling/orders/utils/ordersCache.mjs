export class OrdersCache {
  static cache = new Map()

  static get(orderId) {
    // cargar la orden desde la caché
    const entry = this.cache.get(orderId)
    return entry ? entry.data : null
  }

  static add(orderId, orderData) {
    this.cache.set(orderId, {
      data: orderData
    })
  }
}

export class OrdersInProgress {
  static cache = new Map()

  static validate(orderId, timestamp) {
    const entry = this.cache.get(orderId)

    // validar que exista la orden
    if (!entry) {
      console.warn('🔹 Orden no encontrada en caché')
      return true
    }

    // validar que el timestamp sea mayor (mas reciente)
    if (entry.timestamp > timestamp) {
      console.log('🔹 Ya hay una orden mas reciente, cancelando orden actual')
      return false
    }

    // si no se ha cancelado la orden, se puede continuar
    return true
  }

  static setInProgressOrder(orderId, timestamp) {
    this.cache.set(orderId, { timestamp })
  }
}
