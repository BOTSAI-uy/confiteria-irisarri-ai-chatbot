import { isProductionEnv } from '#config/config.mjs'
import { getServices } from '../config/services/services.mjs'
import { sendToChatwoot } from './chatwoot/sendToChatwoot.mjs'
import { showMessage } from '#logger/showMessage.mjs'

export async function sendToChannels(messages) {
  showMessage(messages)
  if (!isProductionEnv()) {
    return
  }
  if (!Array.isArray(messages)) {
    return console.error('sendToChannels: messages no es un array', messages)
  }
  if (messages.length < 1) {
    return console.error('sendToChannels: messages está vacío')
  }

  //console.log('channels', JSON.stringify(messages, null, 2))
  const services = await getServices()
  if (!services) {
    console.error('sendToChannels: No se encontraron servicios')
    return
  }

  //SS CHATWOOT
  const chatwoot = services.find((service) => service.platform === 'chatwoot')
  if (chatwoot) {
    console.log('Canal de chatwoot activo')
    const chatwootMessages = filterByChannel(messages, 'chatwoot')
    if (chatwootMessages.length > 0) {
      sendToChatwoot(chatwootMessages, chatwoot)
    }
  }
}

function filterByChannel(messages, channel) {
  return messages.filter((message) => message.app !== channel)
}
