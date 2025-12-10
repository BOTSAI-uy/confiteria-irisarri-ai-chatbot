import { appsheetClient } from '#services/appsheet/appsheetClient.mjs'

const NAME_TABLE = 'ORDERS_CONFIG'

export class OrdersConfigAppsheet {
  //ss obtener configuración de orden por id
  static async getOrderConfig() {
    const configData = await SCHEMA.findById('tool')
    if (!configData) {
      throw new Error('Order configuration not found')
    }
    return configData
  }
}

export const SCHEMA = appsheetClient.createSchema(NAME_TABLE, {
  id: {
    type: 'string',
    primary: true,
  },
  deliverySchedule: {
    type: 'object',
    properties: {
      sunday: {
        key: 'delivery_sunday',
        type: 'array',
        itemType: 'string',
      },
      monday: {
        key: 'delivery_monday',
        type: 'array',
        itemType: 'string',
      },
      tuesday: {
        key: 'delivery_tuesday',
        type: 'array',
        itemType: 'string',
      },
      wednesday: {
        key: 'delivery_wednesday',
        type: 'array',
        itemType: 'string',
      },
      thursday: {
        key: 'delivery_thursday',
        type: 'array',
        itemType: 'string',
      },
      friday: {
        key: 'delivery_friday',
        type: 'array',
        itemType: 'string',
      },
      saturday: {
        key: 'delivery_saturday',
        type: 'array',
        itemType: 'string',
      },
    },
  },
  pickUpSchedule: {
    type: 'object',
    properties: {
      sunday: {
        key: 'pickUp_sunday',
        type: 'array',
        itemType: 'string',
      },
      monday: {
        key: 'pickUp_monday',
        type: 'array',
        itemType: 'string',
      },
      tuesday: {
        key: 'pickUp_tuesday',
        type: 'array',
        itemType: 'string',
      },
      wednesday: {
        key: 'pickUp_wednesday',
        type: 'array',
        itemType: 'string',
      },
      thursday: {
        key: 'pickUp_thursday',
        type: 'array',
        itemType: 'string',
      },
      friday: {
        key: 'pickUp_friday',
        type: 'array',
        itemType: 'string',
      },
      saturday: {
        key: 'pickUp_saturday',
        type: 'array',
        itemType: 'string',
      },
    },
  },
})
