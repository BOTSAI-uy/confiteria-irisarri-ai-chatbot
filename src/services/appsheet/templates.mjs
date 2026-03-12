import { appsheetClient } from './appsheetClient.mjs'

const NAME_TABLE = 'TEMPLATES_META'

export class TemplatesAppsheet {
  //ss cargar por id
  async getTemplateById(id) {
    const res = await SCHEMA.findById(id)
    if (!res) {
      console.error(`appsheet - templatesWhatsappMeta: No se encontró el templateWhatsappMeta con id ${id}.`)
      return null
    }
    return res
  }

  //ss agregar múltiples plantillas
  async addTemplates(templates) {
    const res = await SCHEMA.createMany(templates)
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
    type: 'string',
  },
  header: {
    type: 'string',
  },
  body: {
    type: 'string',
  },
  footer: {
    type: 'string',
  },
  buttons: {
    type: 'string',
  },
  language: {
    type: 'string',
  },
  category: {
    type: 'string',
  },
  subCategory: {
    type: 'string',
  },
  format: {
    type: 'string',
  },
})
