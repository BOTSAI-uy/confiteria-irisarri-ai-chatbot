import { getAllSendRequestTags } from '#db/sendRequestTags/getAllSendRequestTags.mjs'

//TT CONSTRUIR ARTÍCULOS
export async function buildSendRequestTags() {
  const sendRequestTags = await getAllSendRequestTags()
  const activeSendRequestTags = sendRequestTags.filter((tag) => tag.status)
  if (activeSendRequestTags.length === 0) {
    return 'No hay etiquetas de solicitud disponibles'
  }

  console.log('Etiquetas de solicitud activas disponibles: ', activeSendRequestTags.length)

  let text = ''
  for (const tag of activeSendRequestTags) {
    text += `**${tag.name} (id: ${tag.id}):**\n`
    text += `Descripción: ${tag.description}\n\n`
  }
  return text
}
