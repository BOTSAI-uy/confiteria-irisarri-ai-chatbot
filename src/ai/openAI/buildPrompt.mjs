//TT MÓDULOS
import { readMd } from '#utilities/readMd.mjs'
import { getFullDateFormatGB, getFullDateFormatUS, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'
import { deletePhoneExtension } from '#utilities/facturapp/formatPhone.mjs'

//TT CONSTRUIR PROMPTS
import { buildPromotions } from './buildPrompt/promotions.mjs'

let BASIC_PROMPT = null

//TT CONSTRUIR PROMPTS
export async function buildPrompt(brain, user) {
  try {
    //SS ESTRUCTURA
    //cargar base
    if (!BASIC_PROMPT) {
      console.info('Cargando contenido del prompt base desde archivo...')
      BASIC_PROMPT = await readMd('./res/docs/basicPrompt.md')
      if (BASIC_PROMPT) {
        console.info('Contenido del prompt base cargado exitosamente.')
      } else {
        console.warn('No se pudo cargar el contenido del prompt base. Verifica que el archivo exista y sea accesible.')
      }
    }
    let txt = ''

    const head = brain.headPrompt
    const body = brain.prompt
    const footer = brain.footerPrompt

    //construir base
    if (BASIC_PROMPT) txt += BASIC_PROMPT + '\n\n- - -\n\n'
    if (head) txt += head + '\n'
    if (body) txt += '\n- - -\n\n' + body + '\n\n- - -\n'
    if (footer) txt += '\n' + footer

    //SS GENERAL
    //usuario
    const userName = user.name || 'desconocido'
    const userNameRegistered = user.registeredName || 'desconocido'
    const userEmail = user.email || 'desconocido'
    txt = txt.replaceAll('{user_name}', userName)
    txt = txt.replaceAll('{user_name_registered}', userNameRegistered)
    txt = txt.replaceAll('{user_email}', userEmail)
    txt = txt.replaceAll('{user_phone}', deletePhoneExtension(user.whatsapp?.id || 'desconocido'))

    //fecha
    txt = txt.replaceAll('{date_now}', getFullDateFormatGB())
    txt = txt.replaceAll('{date_now_us}', getFullDateFormatUS())
    txt = txt.replaceAll('{time_now}', getTimeFormat())

    //SS PROMOCIONES
    //promociones
    if (txt.includes('{promotions}')) {
      const promotions = await buildPromotions()
      txt = txt.replaceAll('{promotions}', promotions)
    }

    //SS TOOLS

    return txt
  } catch (error) {
    console.error('buildPrompt: Error al construir el prompt', error)
    return 'Error al construir el prompt'
  }
}
