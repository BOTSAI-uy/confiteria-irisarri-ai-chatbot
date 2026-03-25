import { getSendRequestTagById } from '#db/sendRequestTags/getSendRequestTagById.mjs'
import { addSendRequestData } from '#db/sendRequestData/addSendRequestData.mjs'
import { getConfig } from '#db/sendRequest/getConfig.mjs'
import { getAssistantById } from '#db/assistants/getAssistantById.mjs'
import { getTemplateById } from '#provider/whatsapp-meta/templates/getTemplateById.mjs'
import { buildTemplate } from '#provider/whatsapp-meta/utilities/buildTemplate.mjs'
import { sendTemplate } from '#provider/whatsapp-meta/templates/sendTemplate.mjs'
import { isProductionEnv } from '#config/config.mjs'

export async function sendRequest(args, user) {
  const { tagId, details } = args
  if (!tagId || !details) {
    console.error('sendRequest: tagId y details son requeridos')
    return { error: 'tagId y details son requeridos' }
  }

  // cargar la etiqueta de solicitud
  const tag = await getSendRequestTagById(tagId)
  if (!tag) {
    console.error('sendRequest: No se ha encontrado la etiqueta de solicitud con id', tagId)
    return { error: `No se ha encontrado la etiqueta de solicitud con id ${tagId}` }
  }

  // crear la solicitud en la base de datos
  const data = await addSendRequestData({
    contact: user.id,
    details,
    tag: tagId,
  })

  // verificar que se haya creado la solicitud
  if (!data) {
    console.error('sendRequest: Error al agregar los datos de la solicitud')
    return { error: 'Error al crear la solicitud' }
  }

  // enviar notificación
  sendNotification(data, tag, user)

  console.info('🧩 Respuesta de función <sendRequest>:\n', JSON.stringify(data, null, 2))
  return { status: 'success', data }
}

//ss enviar notificación a asistentes de la etiqueta
async function sendNotification(request, tag, user) {
  if (!isProductionEnv()) {
    console.info('sendNotification: No se enviarán notificaciones porque no estamos en un entorno de producción')
    return
  }
  // validar asistentes
  if (tag.assistants.length === 0) {
    console.warn('sendRequest: La etiqueta de solicitud no tiene asistentes asignados')
    return
  }

  // cargar configuración
  const config = await getConfig()
  if (!config) {
    console.error('sendRequest: Error al cargar la configuración de envío de solicitudes')
    return
  }

  // validar plantilla
  if (!config.template) {
    console.warn('sendRequest: No se ha configurado una plantilla para las notificaciones de solicitudes')
    return
  }

  // cargar plantilla
  const template = await getTemplateById(config.template)
  if (!template) {
    console.error('sendRequest: No se ha encontrado la plantilla con id', config.template)
    return
  }

  // cargar asistentes
  const assistants = []
  for (const assistantId of tag.assistants) {
    const assistant = await getAssistantById(assistantId)
    if (assistant) {
      assistants.push(assistant)
    }
  }

  // validar asistentes encontrados
  if (assistants.length === 0) {
    console.warn('sendRequest: Ninguno de los asistentes asignados a la etiqueta de solicitud fue encontrado')
    return
  }

  // crear valores de plantilla
  const templateValues = [
    {
      key: 'nombre',
      type: 'string',
      value: user.name || 'desconocido',
    },
    {
      key: 'telefono',
      type: 'string',
      value: user.whatsapp?.id || 'desconocido',
    },
    {
      key: 'asunto',
      type: 'string',
      value: tag.name || 'sin asunto',
    },
    {
      key: 'solicitud',
      type: 'string',
      value: request.details || 'sin detalles',
    },
  ]

  // construir plantilla con valores
  const builtTemplate = buildTemplate(template, templateValues)

  // enviar plantilla a cada asistente
  for (const assistant of assistants) {
    if (!assistant.whatsappId) {
      console.warn(
        `sendRequest: El asistente ${assistant.name} no tiene un ID de WhatsApp configurado, se omitirá la notificación`,
      )
      continue
    }
    console.info(`Enviando notificación de solicitud al asistente ${assistant.name} (${assistant.whatsappId})`)
    await sendTemplate(assistant.whatsappId, builtTemplate)
  }
}
