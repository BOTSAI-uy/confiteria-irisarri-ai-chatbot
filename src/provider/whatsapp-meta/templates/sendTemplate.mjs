import axios from 'axios'
import catchError from '#utilities/catchError.mjs'
import { ENV } from '#config/config.mjs'

export async function sendTemplate(phone, template) {
  // Construir la URL y el cuerpo de la solicitud
  const url = `https://graph.facebook.com/${ENV.WHATSAPP_META_VERSION}/${ENV.WHATSAPP_META_PHONEID}/messages`
  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: phone,
    type: 'template',
    template,
  }
  const headers = {
    Authorization: `Bearer ${ENV.WHATSAPP_META_TOKEN}`,
    'Content-Type': 'application/json',
  }

  // Enviar la solicitud a la API utilizando Axios
  const [error, response] = await catchError(
    axios.post(url, body, {
      headers,
    }),
  )

  // manejar error
  if (error) {
    console.error(
      'sendTemplate: Error al enviar la plantilla de WhatsApp Meta',
      JSON.stringify(error.response?.data, null, 2),
    )
    return null
  }

  // construir el contenido de respuesta
  const content = {
    contents: [
      {
        internalId: response?.data?.messages?.[0]?.id || 'unknown-id',
        text: '',
      },
    ],
    status: 'sent',
  }

  console.info(
    'sendTemplate: Plantilla enviada exitosamente, respuesta de la API:\n',
    JSON.stringify(response.data, null, 2),
  )

  console.info('sendTemplate: body:\n', JSON.stringify(body, null, 2))

  return content
}
