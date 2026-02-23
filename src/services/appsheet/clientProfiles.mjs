import { appsheetClient } from './appsheetClient.mjs'

const NAME_TABLE = 'CLIENTS_PROFILES'

export class ClientProfilesAppsheet {
  //ss obtener perfil por Id
  static async getProfileById(id) {
    const res = await SCHEMA.findById(id)
    if (!res) {
      return null
    }
    return res
  }
}

export const SCHEMA = appsheetClient.createSchema(NAME_TABLE, {
  code: {
    type: 'string',
    primary: true,
  },
  name: {
    type: 'string',
  },
  profile: {
    type: 'string',
  },
})
