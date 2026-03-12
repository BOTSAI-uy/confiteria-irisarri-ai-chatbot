export function buildTemplate(template, templateValues) {
  const data = {
    name: template.name,
    language: {
      code: template.language,
    },
    components: [],
  }

  // recorrer los valores de la plantilla
  for (const templateValue of templateValues) {
    for (const component of template.components) {
      // Procesar componente BODY y HEADER
      const bodyComponent = processTextComponent(component, templateValue)
      if (bodyComponent) {
        // validar agrupación de componentes
        const actual = data.components?.find((c) => c.type === bodyComponent.type)
        if (actual) {
          actual.parameters = actual.parameters.concat(bodyComponent.parameters)
        } else {
          data.components?.push(bodyComponent)
        }
      }
    }
  }

  return data
}

//ss Procesa un componente TEXT (BODY o HEADER)
function processTextComponent(component, templateValue) {
  if (templateValue.type !== 'string') {
    //TODO: agregar soporte para otros tipos de parámetros si es necesario
    return null
  }

  let namedParams

  if (component.type === 'BODY') {
    namedParams = component.example?.body_text_named_params
  } else if (component.type === 'HEADER') {
    namedParams = component.example?.header_text_named_params
  } else {
    return null
  }

  return createTemplateComponent(component.type.toLowerCase(), namedParams, templateValue)
}

//ss Crea un componente de plantilla si tiene parámetros válidos
function createTemplateComponent(componentType, namedParams, templateValue) {
  const parameters = processComponentParameters(namedParams, templateValue.key, templateValue)

  if (parameters.length > 0) {
    return {
      type: componentType,
      parameters,
    }
  }

  return null
}

//ss Procesa los parámetros de un componente y crea los parámetros de texto
function processComponentParameters(namedParams, placeholder, templateValue) {
  const parameters = []

  if (namedParams && namedParams.length > 0) {
    for (const param of namedParams) {
      if (param.param_name === placeholder) {
        parameters.push({
          type: 'text',
          //TODO: limitar caracteres por parámetro según la documentación de WhatsApp Meta
          text: templateValue?.value || '',
          parameter_name: param.param_name,
        })
      }
    }
  }

  return parameters
}
