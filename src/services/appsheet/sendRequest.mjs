import { appsheetClient } from './appsheetClient.mjs'

const NAME_TABLE = 'TOOL_SENDREQUEST'

export class SendRequestAppsheet {
  //ss cargar
  async getConfig(id) {
    const res = await SCHEMA.find()
    if (res.length === 0) {
      console.error(`appsheet - tool_sendRequest: No se encontró la configuración con id ${id}.`)
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
})
