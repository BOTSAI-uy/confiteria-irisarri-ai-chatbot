import { appsheetClient } from './appsheetClient.mjs'

const NAME_TABLE = 'TOOL_SENDREQUEST_DATA'

export class SendRequestDataAppsheet {
  //ss agregar datos
  async addSendRequestData(data) {
    const res = await SCHEMA.create(data)
    return res
  }
}

export const SCHEMA = appsheetClient.createSchema(NAME_TABLE, {
  id: {
    type: 'string',
    primary: true,
  },
  datetime: {
    type: 'date',
    default: () => new Date(),
  },
  tag: {
    type: 'string',
  },
  contact: {
    type: 'string',
  },
  details: {
    type: 'string',
  },
  status: {
    type: 'string',
  },
})
