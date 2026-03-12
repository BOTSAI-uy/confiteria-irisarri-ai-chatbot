import { getSendRequestTagById } from '#db/sendRequestTags/getSendRequestTagById.mjs'
import { addSendRequestData } from '#db/sendRequestData/addSendRequestData.mjs'

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

  console.info('🧩 Respuesta de función <sendRequest>:\n', JSON.stringify(data, null, 2))
  return { status: 'success', data }
}
