import { validateOrder } from '#tools/orders/validateOrder.mjs'
import { applyDiscounts } from '#tools/orders/applyDiscounts.mjs'
import { buildOrder } from '#utilities/openai/buildOrder.mjs'
import { Clients } from '#ai/agentProcess/clientAction.mjs'
import { getAllDiscounts } from '#db/discounts/getAllDiscounts.mjs'
import { addMessageToHistoryOpenAi } from '#ai/openAI/messageHistory.mjs'
import { addOrder as addOrderTool } from '#tools/orders/addOrder.mjs'
import { FunctionProcess } from '#ai/agentProcess/functionProcess.mjs'
import { createOrderSummary } from '#utilities/agent/createOrderSummary.mjs'
import { FUNCTION_STATUS } from '#enums/agent.mjs'
import { getAgent } from '#db/agent/getAgent.mjs'
import { sentToAi } from '#ai/agentProcess/sentToAi.mjs'
import { sendToChannels } from '#channels/channels.mjs'
import { sendResponse } from '#ai/agentProcess/sendResponse.mjs'
import { providerSendMessageInteractive, providerSendMessage } from '#provider/provider.mjs'
import { deletePhoneExtension } from '#utilities/facturapp/formatPhone.mjs'
import { getCurrentShippingAvailability } from '#tools/orders/getCurrentShippingAvailability.mjs'
import { DELIVERY_MODES, PAYMENT_METHODS } from '#enums/tools/orders.mjs'
import { notifyPendingOrder } from './utils/sendAlertPendingOrder.mjs'

const ORDER_ACTIONS = {
  CONFIRM: 'Confirmar Pedido',
  CANCEL: 'Cancelar Pedido',
  MODIFY: 'Modificar Pedido',
}

const ORDER_TIMER = {
  WAITING_CONFIRMATION: 'waiting_confirmation',
  WAITING_MODIFICATION: 'waiting_modification',
  EXPIRED: 'expired',
}

const TIMER = 5 * 60 * 1000 // 5 minutos en milisegundos

function validateReplyAction(response) {
  const cleanAction = response.trim().toLowerCase()
  let action = null
  if (cleanAction.includes(ORDER_ACTIONS.CONFIRM.toLowerCase())) {
    action = ORDER_ACTIONS.CONFIRM
  } else if (cleanAction.includes(ORDER_ACTIONS.CANCEL.toLowerCase())) {
    action = ORDER_ACTIONS.CANCEL
  } else if (cleanAction.includes(ORDER_ACTIONS.MODIFY.toLowerCase())) {
    action = ORDER_ACTIONS.MODIFY
  }
  return action
}

export async function addOrder(args, user, userIdKey, { callId, responseOutput }) {
  const platform = userIdKey.split('-*-')[1]

  // validar que existan artículos en el pedido
  if (!args.articles || args.articles.length === 0) {
    return { success: false, message: 'El pedido debe contener al menos un artículo.' }
  }

  const isDelivery = args.deliveryMode === DELIVERY_MODES.HOME_DELIVERY
  let deliveryDate = ''

  // obtener disponibilidad de envío actual para los artículos
  if (!args.deliveryDate?.date || !args.deliveryDate?.time) {
    const articleCodes = args.articles.map((item) => item.article)
    deliveryDate = await getCurrentShippingAvailability(articleCodes, isDelivery)
    if (!deliveryDate) {
      return {
        success: false,
        message:
          'No se pudo obtener la disponibilidad de envío actual para los artículos. Por favor intenta de nuevo más tarde.',
      }
    }

    console.info('Fecha y hora de entrega obtenida de disponibilidad actual:', deliveryDate)
  } else {
    deliveryDate = `${args.deliveryDate.date} ${args.deliveryDate.time}`
  }

  // cargar datos del pedido desde los argumentos
  const order = {
    name: args.name,
    phone: deletePhoneExtension(user[platform]?.id || ''),
    deliveryDate,
    deliveryMode: args.deliveryMode,
    address: args.address || '',
    note: args.note || '',
    articles: args.articles,
    paymentMethod: args.paymentMethod,
  }

  // validar nombre del cliente
  if (!order.name || order.name.trim() === '') {
    return { success: false, message: 'El nombre del cliente es requerido.' }
  }

  // cargar cliente desde la sesión
  const client = Clients.getClient(user[platform]?.id)
  if (!client) {
    console.warn('No se ha encontrado el cliente en la sesión')
    return {
      success: false,
      message:
        'Perfil de cliente no cargado, por favor solicita al cliente que se identifique mediante cédula, telefono o RUT. o que se registre como cliente nuevo.',
    }
  }

  // validar crédito del cliente si el método de pago es crédito
  if (args.paymentMethod === PAYMENT_METHODS.CREDIT && !client.permiteCredito) {
    return {
      success: false,
      message: 'El cliente no tiene crédito disponible, por favor selecciona otro método de pago.',
    }
  }

  // construir pedido para la base de datos
  let builtOrder = buildOrder(client.codigoCliente, order)

  // validar datos del pedido
  const validation = await validateOrder(builtOrder)
  if (validation.errors && validation.errors.length > 0) {
    return {
      success: false,
      message: 'Error de validación en el pedido',
      details: validation.errors,
    }
  }

  // obtener descuentos disponibles
  const discounts = await getAllDiscounts()
  const activeDiscounts = discounts.filter((d) => d.status)

  // aplicar descuentos al pedido
  builtOrder = await applyDiscounts(builtOrder, activeDiscounts)

  // crear resumen de pedido para confirmación
  const header = 'Resumen de tu pedido'
  const body = await createOrderSummary(builtOrder)
  const footer = 'Por favor confirma si deseas proceder con este pedido.'

  console.info('🧩 Solicitud de confirmación de pedido enviada:\n', body)

  // enviar mensaje interactivo de confirmación al cliente
  const summaryMessageData = {
    type: 'buttons',
    message: { header, body, footer },
    buttonList: [
      { id: 'confirm_order', title: ORDER_ACTIONS.CONFIRM },
      { id: 'cancel_order', title: ORDER_ACTIONS.CANCEL },
      { id: 'modify_order', title: ORDER_ACTIONS.MODIFY },
    ],
  }
  const summaryMessage = await providerSendMessageInteractive(
    user[platform].id,
    summaryMessageData,
    platform,
    'bot',
    'outgoing',
    'bot',
  )

  // enviar mensaje de confirmación al canal
  sendToChannels(summaryMessage)

  //ss iniciar timer para seguimiento de confirmación de pedido
  let timerStatus = ORDER_TIMER.WAITING_CONFIRMATION
  const timer = setInterval(async () => {
    // si han pasado 5 minutos sin confirmación, enviar recordatorio al cliente
    if (timerStatus === ORDER_TIMER.WAITING_CONFIRMATION) {
      console.info('⏰ Han pasado 5 minutos sin confirmación de pedido, Enviado recordatorio al cliente.')

      // enviar mensaje de recordatorio al cliente
      const message = {
        type: 'text',
        text: 'Hola, solo te recordamos que tienes un pedido pendiente de confirmación. Por favor confirma si deseas proceder con el pedido o si necesitas modificarlo.',
      }
      const reminderMessage = await providerSendMessage(user[platform].id, message, platform, 'bot', 'outgoing', 'bot')
      sendToChannels(reminderMessage)

      // actualizar estado del timer
      timerStatus = ORDER_TIMER.WAITING_MODIFICATION
    }

    // si han pasado 10 minutos sin confirmación, notificar a encargado
    else if (timerStatus === ORDER_TIMER.WAITING_MODIFICATION) {
      console.info('🔔 Han pasado 10 minutos sin confirmación de pedido')

      // asignar estado de pedido a expirado
      timerStatus = ORDER_TIMER.EXPIRED

      // eliminar timer para evitar que siga enviando recordatorios
      clearInterval(timer)

      // notificar pedido pendiente de confirmación al encargado (por desarrollar)
      await notifyPendingOrder(client, user[platform].id)
    } else {
      console.info('⏰ Timer de confirmación de pedido detenido.')
      clearInterval(timer)
    }
  }, TIMER)

  //ss agregar función a la sesión
  FunctionProcess.addFunction(userIdKey, async (response) => {
    //agregar respuesta a historial
    await addMessageToHistoryOpenAi(userIdKey, [...responseOutput], user)
    console.info('🧩 Confirmación de pedido recibida:', response)
    console.info('🧩 Deteniendo timer de confirmación de pedido.')
    clearInterval(timer)

    let result

    const action = validateReplyAction(response)
    // si la acción es cancelar pedido
    if (action === ORDER_ACTIONS.CONFIRM) {
      // agregar pedido usando la herramienta
      const newOrder = await addOrderTool(builtOrder)

      // si el pedido se creó correctamente
      if (newOrder?.success) {
        result = { status: true, message: 'Pedido creado correctamente.', order: newOrder.data }
      }
      // si hubo un error al crear el pedido
      else {
        result = {
          success: false,
          message: newOrder?.message || 'Error al crear el pedido',
        }
      }
    }

    // si la acción es cancelar pedido
    else if (action === ORDER_ACTIONS.CANCEL) {
      result = {
        success: false,
        message: 'El pedido ha sido cancelado por el cliente. preguntando si le puedo ayudar en algo más.',
      }
    }
    // si la acción es modificar pedido
    else if (action === ORDER_ACTIONS.MODIFY) {
      result = {
        success: false,
        message: 'El cliente ha solicitado modificar el pedido. preguntando que cambios desea realizar.',
      }
    }
    // si la acción no es reconocida
    else {
      result = {
        success: false,
        message: 'Error al montar orden. el cliente no confirmó, canceló o solicitó modificar el pedido.',
      }
    }

    console.info('🧩 Respuesta de función <addOrder>:\n', JSON.stringify(result, null, 2))

    // agregar resultado a historial
    const resString = JSON.stringify(result, null, 2)
    await addMessageToHistoryOpenAi(
      userIdKey,
      [{ type: 'function_call_output', call_id: callId, output: resString }],
      user,
    )

    // Cargar configuración del agente
    const agentConfig = await getAgent()
    if (!agentConfig) {
      console.error('Agente: Error al cargar configuración')
      return null
    }

    const resAi = await sentToAi(agentConfig.ai.provider, userIdKey, user, agentConfig)

    // Enviar respuesta al usuario si existe
    if (resAi) {
      const res = await sendResponse(agentConfig, resAi, user[platform].id, userIdKey, platform, [], user)
      if (res) {
        sendToChannels(res)
      }
    }
  })

  //ss indicar que se está a la espera de confirmación
  return FUNCTION_STATUS.IN_PROGRESS
}
