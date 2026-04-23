import { EventAlertAppsheet } from '#services/appsheet/eventAlert.mjs'
import { getTemplateById } from '#provider/whatsapp-meta/templates/getTemplateById.mjs'
import { getAssistantById } from '#db/assistants/getAssistantById.mjs'
import { buildTemplate } from '#provider/whatsapp-meta/utilities/buildTemplate.mjs'
import { sendTemplate } from '#provider/whatsapp-meta/templates/sendTemplate.mjs'
import { isProductionEnv } from '#config/config.mjs'

export async function notifyPendingOrder(client, phone) {
  try {
    const eventAlertAppsheet = new EventAlertAppsheet()
    const config = await eventAlertAppsheet.getConfig()

    if (!config) {
      console.warn(
        'No se encontró la configuración para EventAlertAppsheet, no se enviará la notificación de pedido pendiente.',
      )
      return
    }

    // validar que este activo
    if (!config.pendingOrderStatus) {
      console.warn('La notificación de pedido pendiente está desactivada en la configuración de EventAlertAppsheet.')
      return
    }

    // validar que tenga plantilla
    if (!config.pendingOrderTemplate) {
      console.warn('No se encontró la plantilla para la notificación de pedido pendiente en EventAlertAppsheet.')
      return
    }

    // validar que tenga asistentes configurados
    if (!config.pendingOrderAssistants || config.pendingOrderAssistants.length === 0) {
      console.warn(
        'No se encontraron asistentes configurados para la notificación de pedido pendiente en EventAlertAppsheet. No se enviará la notificación.',
      )
      return
    }

    // cargar plantilla
    const template = await getTemplateById(config.pendingOrderTemplate)
    if (!template) {
      console.warn(
        `No se encontró la plantilla configurada para la notificación de pedido pendiente en EventAlertAppsheet con el id ${config.pendingOrderTemplate}. No se enviará la notificación.`,
      )
      return
    }

    // cargar asistentes
    const assistants = []
    for (const assistantId of config.pendingOrderAssistants) {
      const assistant = await getAssistantById(assistantId)
      if (assistant) {
        assistants.push(assistant)
      }
    }

    // validar asistentes encontrados
    if (assistants.length === 0) {
      console.warn(
        'No se encontraron asistentes válidos para la notificación de pedido pendiente en EventAlertAppsheet. No se enviará la notificación.',
      )
      return
    }

    // crear valores de plantilla
    const templateValues = [
      {
        key: 'nombre',
        type: 'string',
        value: `${client.nombre} ${client.apellidos}`,
      },
      {
        key: 'telefono',
        type: 'string',
        value: phone || 'desconocido',
      },
      {
        key: 'asunto',
        type: 'string',
        value: 'Pedido pendiente de confirmación',
      },
      {
        key: 'solicitud',
        type: 'string',
        value:
          'El cliente no confirmó su pedido después de 10 minutos desde la solicitud. Por favor hacer seguimiento personalizado para confirmar si desea proceder con el pedido, modificarlo o cancelarlo.',
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
      if (!isProductionEnv()) {
        console.info(
          `Entorno de desarrollo: No se enviará la notificación al asistente ${assistant.name} (${assistant.whatsappId})`,
        )
        continue
      }
      console.info(`Enviando notificación de solicitud al asistente ${assistant.name} (${assistant.whatsappId})`)
      await sendTemplate(assistant.whatsappId, builtTemplate)
    }
  } catch (error) {
    console.error('Error al enviar la notificación de pedido pendiente:', error)
  }
}
