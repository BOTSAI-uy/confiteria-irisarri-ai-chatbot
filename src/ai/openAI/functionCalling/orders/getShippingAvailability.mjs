import { getShippingAvailability as getShippingAvailabilityTool } from '#tools/orders/getShippingAvailability.mjs'
import { DELIVERY_MODES } from '#enums/tools/orders.mjs'

export async function getShippingAvailability(args) {
  // validar que existan artículos en el pedido
  if (!args.deliveryMode) {
    return { success: false, message: 'El modo de entrega es requerido.' }
  }

  const isDelivery = args.deliveryMode === DELIVERY_MODES.HOME_DELIVERY

  // Obtener disponibilidad de envío desde la herramienta
  const availability = await getShippingAvailabilityTool(isDelivery)

  // Verificar si se obtuvo correctamente
  if (!availability || availability.length === 0) {
    console.error('No se pudo obtener la disponibilidad para: ', args.deliveryMode)
    return {
      success: false,
      message: 'No se pudo obtener la disponibilidad de envío.',
    }
  }
  console.info('🧩 Respuesta de función <getShippingAvailability>: \n', JSON.stringify(availability, null, 2))
  return {
    success: true,
    availability,
  }
}
