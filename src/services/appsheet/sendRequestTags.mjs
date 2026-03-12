import { appsheetClient } from './appsheetClient.mjs'

const NAME_TABLE = 'TOOL_SENDREQUEST_TAGS'

export class SendRequestTagsAppsheet {
  //ss obtener todas
  async getAllSendRequestTags() {
    const res = await SCHEMA.find()
    return res
  }

  //ss obtener por id
  async getSendRequestTagById(id) {
    const res = await SCHEMA.findById(id)
    if (!res) {
      console.error('getSendRequestTagById: No se ha encontrado la etiqueta con id', id)
      return null
    }
    return res
  }
}

export const SCHEMA = appsheetClient.createSchema(NAME_TABLE, {
  id: {
    type: 'string',
    primary: true,
  },
  status: {
    type: 'boolean',
  },
  name: {
    type: 'string',
  },
  description: {
    type: 'string',
  },
  assistants: {
    type: 'array',
    itemType: 'string',
  },
})
