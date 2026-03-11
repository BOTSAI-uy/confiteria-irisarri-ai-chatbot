import { getTemplates } from '#provider/whatsapp-meta/templates/getTemplates.mjs'
import { addTemplates } from '#db/templates/addTemplates.mjs'

export async function refreshTemplates() {
  try {
    // obtener templates desde WhatsApp Meta
    const templates = await getTemplates()

    // preparar datos para agregar a la base de datos
    const newTemplates = []
    for (const template of templates) {
      const data = {
        id: template.id,
        name: template.name,
        status: template.status,
        header: template.components?.find((c) => c.type === 'HEADER')?.text || '',
        body: template.components?.find((c) => c.type === 'BODY')?.text || '',
        footer: template.components?.find((c) => c.type === 'FOOTER')?.text || '',
        buttons: '', //TODO: procesar botones
        language: template.language,
        category: template.category,
        subCategory: template.sub_category,
        format: template.parameter_format,
      }
      newTemplates.push(data)
    }

    console.info(`plantillas de whatsapp meta obtenidas`, newTemplates.length)

    // agregar templates a la base de datos
    const addedTemplates = await addTemplates(newTemplates)
    if (addedTemplates.length === 0) {
      console.warn('No se pudieron agregar los templates.')
      return
    }
    console.info(`plantillas de whatsapp meta: ${addedTemplates.length}`)
    return addedTemplates
  } catch (error) {
    console.error(`Error al refrescar las plantillas: ${error.message}`)
    return []
  }
}
