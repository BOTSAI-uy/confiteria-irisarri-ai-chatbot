import { appsheetClient } from './appsheetClient.mjs'

const NAME_TABLE = 'ASSISTANTS'

export class AssistantsAppsheet {
  // ss obtener todos los asistentes
  static async getAllAssistants() {
    const res = await SCHEMA.find()
    return res
  }

  //ss obtener asistente por id
  static async getAssistantById(id) {
    const res = await SCHEMA.findById(id)
    if (!res) {
      console.error(`appsheet - assistants: No se encontró el assistant con id ${id}.`)
      return null
    }
    return res
  }
}

export const SCHEMA = appsheetClient.createSchema(NAME_TABLE, {
  id: {
    key: 'ID',
    type: 'string',
    primary: true,
  },
  name: {
    key: 'NAME',
    type: 'string',
  },
  email: {
    key: 'EMAIL',
    type: 'string',
  },
  whatsappId: {
    key: 'WHATSAPP_ID',
    type: 'string',
  },
  phone: {
    key: 'PHONE',
    type: 'string',
  },
  detectAssistantCondition: {
    key: 'DETECT_ASSISTANT_CONDITION',
    type: 'string',
  },
  detectAssistantMessage: {
    key: 'DETECT_ASSISTANT_MESSAGE',
    type: 'string',
  },
  detectAssistantIdle: {
    key: 'DETECT_ASSISTANT_IDLE',
    type: 'number',
  },
})
