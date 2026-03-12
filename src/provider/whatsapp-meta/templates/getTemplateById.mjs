import axios from 'axios'
import { ENV } from '#config/config.mjs'
import catchError from '#utilities/catchError.mjs'

export async function getTemplateById(templateId) {
  const url = `https://graph.facebook.com/${ENV.WHATSAPP_META_VERSION}/${templateId}`

  const [error, response] = await catchError(
    axios.get(url, {
      params: {
        access_token: ENV.WHATSAPP_META_TOKEN,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  )

  // manejar errores
  if (error) {
    console.error(
      { error: error.response?.data || error.message, stack: error.stack },
      `getTemplateById: Error al obtener la plantilla con id ${templateId} desde WhatsApp Meta`,
    )
    return null
  }

  return response.data
}
