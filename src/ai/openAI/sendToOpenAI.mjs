import { OpenAI } from 'openai'
//TT MÓDULOS
import { getCredentialsOpenAI } from './credentials.mjs'
import { getMessageHistory, addMessageToHistoryOpenAi } from './messageHistory.mjs'
import { functionCalling } from './functionCalling.mjs'
import { getToolsOpenAi } from './tools.mjs'
import { select } from './models/select.mjs'
import { FUNCTION_STATUS } from '#enums/agent.mjs'

export async function sendToOpenAI(userIdKey, user, aiModel, aiMaxTokens, aiTemperature) {
  try {
    //cargar credenciales
    const agentConfig = await getCredentialsOpenAI()
    if (!agentConfig) {
      console.error('sendToOpenAI: No se han encontrado credenciales de OpenAI')
      return null
    }
    const openai = new OpenAI({
      apiKey: agentConfig.ai.token,
    })

    //cargar historial
    const history = await getMessageHistory(userIdKey, user)

    //cargar tools
    const tools = await getToolsOpenAi(user.brain)

    const model = await select(aiModel)

    console.time('> Tiempo de respuesta OpenAI')
    const response = await model(openai, {
      aiModel,
      history,
      aiMaxTokens,
      aiTemperature,
      tools,
    })
    console.timeEnd('> Tiempo de respuesta OpenAI')

    const functionCall = response.output.find((msg) => msg.type === 'function_call')
    //SS TOOLS
    if (functionCall) {
      //ejecutar function
      const resFunction = await functionCalling(functionCall, user, userIdKey, response.output)

      // si la función está en progreso, no continuar
      if (resFunction === FUNCTION_STATUS.IN_PROGRESS) {
        return resFunction
      }

      //agregar respuesta a historial
      await addMessageToHistoryOpenAi(userIdKey, [...response.output, resFunction], user)
      //enviar respuesta
      return await sendToOpenAI(userIdKey, user, aiModel, aiMaxTokens, aiTemperature)
    }
    //SS TEXTO
    else {
      //console.log('Respuesta en texto:', message.content)
      return { type: 'text', text: response.output_text }
    }
  } catch (error) {
    console.error('Error al enviar el mensaje a OpenAI:', error)
    return null
  }
}
