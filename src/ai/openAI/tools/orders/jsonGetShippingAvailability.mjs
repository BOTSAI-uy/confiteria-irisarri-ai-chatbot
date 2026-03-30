import { DELIVERY_MODES } from '#enums/tools/orders.mjs'

export const functionName = 'getShippingAvailability'

export async function getJson() {
  const jsonData = {
    type: 'function',
    name: functionName,
    description: 'Obtiene la disponibilidad de envío para los artículos del pedido.',
    parameters: {
      type: 'object',
      properties: {
        deliveryMode: {
          type: 'string',
          enum: Object.values(DELIVERY_MODES),
          description: 'Modo de entrega del pedido, ya sea a domicilio o para recogida en tienda',
        },
      },
      required: ['deliveryMode'],
      additionalProperties: false,
    },
  }
  return jsonData
}
