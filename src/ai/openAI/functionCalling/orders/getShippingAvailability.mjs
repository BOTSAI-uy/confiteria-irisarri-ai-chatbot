import { getShippingAvailability as getShippingAvailabilityTool } from '#tools/orders/getShippingAvailability.mjs'

export async function getShippingAvailability() {
  // Obtener disponibilidad de envío desde la herramienta
  const availability = await getShippingAvailabilityTool()

  // Verificar si se obtuvo correctamente
  if (!availability || availability.length === 0) {
    console.error('No se pudo obtener la disponibilidad de envío.')
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
