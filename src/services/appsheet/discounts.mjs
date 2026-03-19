import { appsheetClient } from './appsheetClient.mjs'

const NAME_TABLE = 'DISCOUNTS'

export class DiscountAppsheet {
  //ss agregar múltiples plantillas
  async getAllDiscounts() {
    const res = await SCHEMA.find()
    return res
  }
}

export const SCHEMA = appsheetClient.createSchema(NAME_TABLE, {
  id: {
    type: 'string',
    primary: true,
  },
  name: {
    type: 'string',
  },
  status: {
    type: 'boolean',
  },
  groupId: {
    type: 'string',
  },
  days: {
    type: 'array',
    itemType: 'string',
  },
  discount: {
    type: 'number',
  },
})
