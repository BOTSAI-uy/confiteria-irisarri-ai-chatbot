import { appsheetClient } from './appsheetClient.mjs'

const NAME_TABLE = 'BRAINS'

export class BrainsAppsheet {
  //ss cargar brain por id
  static async getBrainById(id) {
    const res = await SCHEMA.findById(id)
    if (!res) {
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
  //tools
  toolSendRequest: {
    key: 'TOOL_SENDREQUEST',
    type: 'boolean',
  },
  //prompts
  headPrompt: {
    key: 'HEAD_PROMPT',
    type: 'string',
  },
  prompt: {
    key: 'PROMPT',
    type: 'string',
  },
  footerPrompt: {
    key: 'FOOTER_PROMPT',
    type: 'string',
  },
})
