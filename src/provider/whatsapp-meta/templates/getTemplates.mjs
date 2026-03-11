import axios from 'axios'
import { ENV } from '#config/config.mjs'

import catchError from '#utilities/catchError.mjs'

export async function getTemplates() {
  const baseUrl = `https://graph.facebook.com/${ENV.WHATSAPP_META_VERSION}/${ENV.WHATSAPP_META_ACCOUNTID}/message_templates`
  const headers = {
    Authorization: `Bearer ${ENV.WHATSAPP_META_TOKEN}`,
    'Content-Type': 'application/json',
  }

  const maxPages = 50
  const timeout = 10000
  const retries = 2
  const maxItems = 1000

  const allTemplates = []
  let url = baseUrl

  for (let page = 0; url && page < maxPages; page++) {
    let response
    let attempt = 0
    // retry simple with exponential backoff
    while (attempt <= retries) {
      const [err, res] = await catchError(axios.get(url, { headers, timeout }))

      // manejar error y reintentar si es necesario
      if (err) {
        attempt++
        console.warn({ err, attempt, url }, 'getTemplates: intento fallido, reintentando')
        if (attempt > retries) {
          console.error({ err, url }, 'getTemplates: error después de retries')
          break
        }
        const backoff = Math.min(5000, 2 ** attempt * 500)
        await new Promise((resolve) => setTimeout(resolve, backoff))
        continue
      }

      // asignar la respuesta válida y salir del bucle de reintentos
      response = res
      break
    }

    // procesar la respuesta
    const body = response.data
    if (Array.isArray(body?.data)) {
      allTemplates.push(...body.data)
      if (maxItems && allTemplates.length > maxItems) {
        allTemplates.splice(maxItems)
        break
      }
    }

    // Determinar la siguiente URL: preferir `paging.next`, si no existe usar el cursor `after`
    if (body?.paging?.next) {
      url = body.paging.next
    } else if (body?.paging?.cursors?.after) {
      const after = body.paging.cursors.after
      const sep = baseUrl.includes('?') ? '&' : '?'
      url = `${baseUrl}${sep}after=${encodeURIComponent(after)}`
    } else {
      url = undefined
    }
  }

  return allTemplates
}
