import { getTemplates } from '#provider/whatsapp-meta/templates/getTemplates.mjs'
import { addTemplatesWhatsappMeta } from '#db/templates/templatesWhatsappMeta/addTemplatesWhatsappMeta.js'

export async function refreshTemplates() {
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

  console.info(`plantillas de whatsapp meta obtenidas`, newTemplates)

  // agregar templates a la base de datos
  const addedTemplates = await addTemplatesWhatsappMeta(newTemplates)
  if (!addedTemplates) {
    console.warn('No se pudieron agregar los templates.')
    return
  }
  console.info(`plantillas de whatsapp meta: ${addedTemplates.length}`)
  return addedTemplates
}
