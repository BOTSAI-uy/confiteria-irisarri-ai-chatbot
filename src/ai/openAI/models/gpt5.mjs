export async function gpt5(openai, { aiModel, history, aiMaxTokens, tools }) {
  const data = {
    model: aiModel,
    input: history,
    //max_output_tokens: aiMaxTokens,
    parallel_tool_calls: false,
    tools,
    reasoning: {
      effort: 'low',
    },
  }
  const response = await openai.responses.create(data)

  return response
}
