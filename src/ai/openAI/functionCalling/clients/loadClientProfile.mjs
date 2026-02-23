import { getClientByDni } from '#db/clients/getClientByDni.mjs'
import { getClientByPhone } from '#db/clients/getClientByPhone.mjs'
import { ClientProfilesAppsheet } from '#services/appsheet/clientProfiles.mjs'

import { cleanDataClient } from '#utilities/clients/cleanDataClient.mjs'
import { Clients } from '#ai/agentProcess/clientAction.mjs'

const ACTION = {
  dni: getClientByDni,
  phone: getClientByPhone,
  rut: getClientByDni,
}

export async function loadClientProfile(args, user, userIdKey) {
  const platform = userIdKey.split('-*-')[1]
  const { number, dataType } = args
  //verificar datos
  if (!number || !dataType) {
    console.error('number y dataType son requeridos')
    return { response: 'error: number and dataType are required' }
  }

  // seleccionar acción
  const action = ACTION[dataType]
  if (!action) {
    console.error('dataType no soportado')
    return { response: 'error: dataType not supported' }
  }

  // obtener cliente
  const client = await action(number)
  if (!client) {
    console.warn('No se ha encontrado el cliente en la base de datos')
    return { response: 'error: client not found' }
  }

  // agregar cliente a la sesión
  Clients.addClient(user[platform]?.id, client)

  // verificar si es cliente de empresa
  if (client.empresa) {
    console.log('Cliente de empresa detectado:', client)
  }

  // cargar perfil de cliente desde Appsheet
  let clientProfile = null
  if (client.codigoCliente) {
    console.log('Cargando perfil de cliente desde Appsheet para codigoCliente:', client.codigoCliente)
    clientProfile = await ClientProfilesAppsheet.getProfileById(String(client.codigoCliente))
  }

  // agregar cliente a la sesión
  const cleanData = cleanDataClient(client)
  if (clientProfile) {
    console.log('Perfil de cliente encontrado en Appsheet:', clientProfile)
    cleanData.profile = clientProfile
  }
  console.info('🧩 Respuesta de función <loadClientProfile>:\n', JSON.stringify(cleanData, null, 2))
  return { status: 'success', client: cleanData }
}
