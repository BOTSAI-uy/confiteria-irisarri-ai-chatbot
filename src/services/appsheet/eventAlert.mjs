import { appsheetClient } from './appsheetClient.mjs'

const NAME_TABLE = 'EVENT_ALERT'

export class EventAlertAppsheet {
  //ss cargar
  async getConfig() {
    const res = await SCHEMA.find()
    if (res.length === 0) {
      return null
    }
    return res[0]
  }
}

export const SCHEMA = appsheetClient.createSchema(NAME_TABLE, {
  id: {
    type: 'string',
    primary: true,
  },
  template: {
    type: 'string',
  },
  pendingOrderStatus: {
    type: 'boolean',
  },
  pendingOrderTemplate: {
    type: 'string',
  },
  pendingOrderAssistants: {
    type: 'array',
    itemType: 'string',
  },
})
