import catchError from '#utilities/catchError.mjs'
import { getOrderConfig } from '#db/ordersConfig/getOrderConfig.mjs'
import { ShippingAvailabilityDayFacturapp } from '#services/facturapp/shippingAvailabilityDay.mjs'

const TOTAL_DAYS = 14 // total de días a mostrar

const WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export async function getShippingAvailability(isDelivery = true, anticipationHours = 0) {
  // cargar configuración de orden
  const orderConfig = await getOrderConfig()
  if (!orderConfig || (!orderConfig.deliverySchedule && !orderConfig.pickUpSchedule)) {
    console.error('No se pudo obtener la configuración de orden o el horario de entrega.')
    return null
  }

  const schedule = isDelivery ? orderConfig.deliverySchedule : orderConfig.pickUpSchedule

  // fecha actual con anticipación
  const startDate = new Date()
  const anticipationTime = isDelivery ? orderConfig.deliveryAnticipationTime || 0 : 0 //minutos de anticipación

  // agregar tiempo de anticipación a la fecha actual
  startDate.setMinutes(startDate.getMinutes() + anticipationTime)

  // usar hora local sin zona horaria
  console.log('Fecha de inicio:', startDate.toLocaleString())
  // obtener los siguientes 7 días (omitiendo hoy) con formato YYYY-MM-DD HH:mm
  const availability = []
  let noHours = anticipationHours
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const nextDay = new Date(startDate)
    nextDay.setDate(startDate.getDate() + i)

    // obtener día de la semana
    const dayKey = WEEK_DAYS[nextDay.getDay()]

    // Formatear fecha usando hora local en lugar de UTC
    const year = nextDay.getFullYear()
    const month = String(nextDay.getMonth() + 1).padStart(2, '0')
    const day = String(nextDay.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`

    // obtener disponibilidad desde Facturapp
    const [error, facturappData] = await catchError(
      ShippingAvailabilityDayFacturapp.getAvailabilityDay(formattedDate, true),
    )
    // manejar error
    if (error) {
      console.error(`Error al obtener disponibilidad de Facturapp para ${formattedDate}:`, error.message)
      continue
    }

    // construir objeto de disponibilidad
    const data = {
      date: formattedDate,
      day: dayKey,
      times: [],
    }

    const times = schedule[dayKey] || []
    for (const time of times) {
      const [hour, minute = 0] = time.split(':').map(Number)

      // construir fecha/hora de la franja en horario local
      const slot = new Date(nextDay)
      slot.setHours(hour, minute, 0, 0)

      // omitir franjas anteriores a la fecha/hora actual (considerando tiempo de anticipación)
      if (slot < startDate) {
        console.debug(`Omitiendo franja pasada para ${formattedDate} a las ${time}`)
        continue
      }

      // consumir solo slots disponibles
      if (noHours > 0) {
        noHours = noHours - 1
        console.debug(`Omitiendo franja por horas de anticipación para ${formattedDate} a las ${time}`)
        continue
      }

      // buscar en los datos de Facturapp (comprobando por hora)
      const facturappEntry = facturappData.find((entry) => entry.hora === hour && entry.admiteMas)
      if (!facturappEntry) {
        console.log(`Franja horaria no disponible para ${formattedDate} a las ${time}:`, hour)
        continue // omitir si no hay disponibilidad
      }

      data.times.push(time)
    }
    availability.push(data)
  }
  return availability
}
