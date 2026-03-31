export const functionName = 'addClientProfile'

export async function getJson() {
  const jsonData = {
    type: 'function',
    name: functionName,
    description: 'Registra a un nuevo cliente a la base de datos',
    parameters: {
      type: 'object',
      properties: {
        dni: {
          type: 'string',
          description: 'Cédula del cliente',
        },
        name: {
          type: 'string',
          description: 'Nombre del cliente',
        },
        lastName: {
          type: 'string',
          description: 'Apellidos del cliente',
        },
        address: {
          type: 'string',
          description: 'Dirección del cliente',
        },
        contact: {
          type: ['string', 'null'],
          description: 'Persona de contacto del cliente, en caso de que sea una empresa',
        },
      },
      required: ['dni', 'name', 'lastName', 'address', 'contact'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonData
}
