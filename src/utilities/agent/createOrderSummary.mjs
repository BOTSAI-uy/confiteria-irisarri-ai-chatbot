import { getArticleByCode } from '#db/articles/getArticleByCode.mjs'

// crear resumen de orden para confirmación
export async function createOrderSummary(order) {
  // datos generales del pedido
  let summary = `**Nombre del Cliente:** ${order.name}\n`
  summary += `**Método de Pago:** ${order.paymentMethod}\n`
  if (order.address) summary += `**Dirección de Entrega:** ${order.address}\n`
  summary += `**Modo de Entrega:** ${order.deliveryMode}\n`
  summary += `**Fecha de Entrega:** ${order.deliveryDate}\n`
  if (order.note) summary += `**Nota:** ${order.note}\n`

  // listar artículos del pedido
  summary += `\n**Artículos:**\n\n`

  let totalPrice = 0
  let isKgBased = false // bandera para artículos por kg
  for (const item of order.articles) {
    const article = await getArticleByCode(item.article)
    if (!article) {
      console.error(`Artículo con código ${item.article} no encontrado para el resumen.`)
      continue
    }

    // calcular total del artículo
    let itemTotal = 0

    // si el artículo tiene descuento, aplicar descuento al precio de venta
    if (article.discount) {
      const discountFactor = 1 - article.discount
      itemTotal = article.precioVenta * discountFactor * item.quantity
      summary += `- ${capitalizeFirst(article.descripcion)}  (x${item.quantity} ${
        article.unidadMedida
      }) = **$${itemTotal.toFixed(2)}** (descuento ${article.discount * 100}%)\n`
    }
    // si el artículo no tiene descuento, usar precio de venta normal
    else {
      itemTotal = article.precioVenta * item.quantity
      summary += `- ${capitalizeFirst(article.descripcion)}  (x${item.quantity} ${
        article.unidadMedida
      }) = **$${itemTotal.toFixed(2)}**\n`
    }

    // agregar nota del artículo si existe
    if (item.note) {
      summary += `${formatNote(item.note)}\n`
    }

    // agregar total del artículo al total general
    totalPrice += itemTotal

    // verificar si el artículo es por kg
    if (String(article.unidadMedida).toLowerCase().includes('kg')) {
      isKgBased = true
    }
  }

  summary += `\n**Total: $${totalPrice.toFixed(2)}**`

  // nota sobre artículos por kg
  if (isKgBased) {
    summary += `\n\n_Nota: Los artículos vendidos por kg pueden variar su peso final al momento de la entrega._`
  }
  return summary
}

function capitalizeFirst(text) {
  if (!text) return ''
  const trimmedText = text.toLowerCase().trim()
  return trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1)
}

function formatNote(note) {
  // agregar __ para cada lineas y agregar espacio al inicio
  const formatted = capitalizeFirst(note)
    .split('\n')
    .map((line) => `  _${line.trim()}_`)
    .join('\n')
  return formatted || 'Sin nota'
}
