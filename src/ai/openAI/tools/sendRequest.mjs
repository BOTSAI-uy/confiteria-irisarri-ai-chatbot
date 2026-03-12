export const functionName = 'sendRequest'

export async function getJson() {
  const jsonData = {
    type: 'function',
    name: functionName,
    description:
      'Envía una solicitud utilizando una etiqueta específica, es útil para remitir solicitudes a diferentes departamentos o asistentes, dependiendo de la etiqueta seleccionada',
    parameters: {
      type: 'object',
      properties: {
        tagId: {
          type: 'string',
          description: 'ID de la etiqueta de solicitud',
        },
        details: {
          type: 'string',
          description: 'Detalles de la solicitud',
        },
      },
      required: ['tagId', 'details'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonData
}
