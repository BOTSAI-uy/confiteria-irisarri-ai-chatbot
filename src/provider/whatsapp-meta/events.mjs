//TT MÓDULOS
import { eventMessages } from './messages/eventMessages.mjs'
import { eventContacts } from './contacts/eventContacts.mjs'

//TT DETECTAR EVENTOS
export function events(data) {
  if (data.entry) {
    for (const event of data.entry) {
      if (event.changes) {
        for (const change of event.changes) {
          if (change.value) {
            if (change.value.contacts) {
              eventContacts(change.value.contacts)
            }
            if (change.value.messages) {
              eventMessages(change.value.messages)
            } else {
              console.log('No hay mensajes')
              console.log('change.value:\n', JSON.stringify(change.value, null, 2))
            }
          } else {
            console.log('No hay cambios')
          }
        }
      } else {
        console.log('No hay cambios')
      }
    }
  } else {
    console.log('No hay eventos')
  }
}
