import { appsheetClient } from './appsheetClient.mjs'
import { revertFormatDateTime } from '#utilities/appsheet/formatDateTime.mjs'

const NAME_TABLE = 'ARTICLES_DAILY'

export class DailyArticlesAppsheet {
  // ss obtener todos los artículos
  static async getAllDailyArticles() {
    const res = await SCHEMA.find()
    return res
  }

  //ss obtener artículo por código
  static async getDailyArticleByCode(code) {
    const res = await SCHEMA.findById(code)
    if (!res) {
      console.error(`appsheet - dailyArticles: No se encontró el artículo con código ${code}.`)
      return null
    }
    return res
  }

  //ss obtener artículos actualizados desde una fecha
  static async getUpdatedDailyArticles(sinceDate) {
    const dateValid = revertFormatDateTime(sinceDate)
    const res = await SCHEMA.find({
      Selector: `Filter(${NAME_TABLE}, [updateDate] > "${dateValid}")`
    })
    // validar resultado
    if (!res || res.length === 0) {
      console.error(`appsheet - dailyArticles: No se encontraron datos de artículos actualizados desde ${dateValid}`)
      return null
    }
    return res
  }
}

export const SCHEMA = appsheetClient.createSchema(NAME_TABLE, {
  codigo: {
    key: 'code',
    type: 'string',
    primary: true
  },
  descripcion: {
    key: 'description',
    type: 'string'
  },
  descripcionAvanzada: {
    key: 'advancedDescription',
    type: 'string'
  },
  addPrompt: {
    key: 'addPrompt',
    type: 'boolean'
  },
  alias: {
    key: 'alias',
    type: 'string'
  },
  active: {
    key: 'active',
    type: 'boolean'
  },
  ramo: {
    key: 'branch',
    type: 'string'
  },
  familia: {
    key: 'family',
    type: 'string'
  },
  grupo: {
    key: 'group',
    type: 'string'
  },
  precioVenta: {
    key: 'salePrice',
    type: 'number'
  },
  unidadMedida: {
    key: 'unit',
    type: 'string'
  },
  fotoPortada: {
    key: 'urlImage',
    type: 'string'
  },
  fechaUpdate: {
    key: 'updateDate',
    type: 'string'
  },
  // adiciones
  restricciones: {
    key: 'restriction',
    type: 'boolean'
  },
  cantidadMinima: {
    key: 'minimumQuantity',
    type: 'number'
  },
  multipleDe: {
    key: 'multipleOf',
    type: 'number'
  },
  horasDeAnticipacion: {
    key: 'hoursInAdvance',
    type: 'number'
  },
  libreDeAzucar: {
    key: 'sugarFree',
    type: 'boolean'
  },
  aptoParaCeliacos: {
    key: 'suitableForCeliacs',
    type: 'boolean'
  },
  esVegano: {
    key: 'vegan',
    type: 'boolean'
  },
  remitirHumano: {
    key: 'goToHuman',
    type: 'boolean'
  },
  commentario: {
    key: 'comment',
    type: 'string'
  }
})
