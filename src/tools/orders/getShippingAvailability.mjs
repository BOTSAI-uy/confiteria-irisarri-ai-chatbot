import catchError from '#utilities/catchError.mjs'
import { getOrderConfig } from '#db/ordersConfig/getOrderConfig.mjs'
import { ShippingAvailabilityDayFacturapp } from '#services/facturapp/shippingAvailabilityDay.mjs'

const START_DAYS = 0 // días desde hoy para comenzar a mostrar disponibilidad
const TOTAL_DAYS = 10 // total de días a mostrar

const WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export async function getShippingAvailability() {
  // cargar configuración de orden
  const orderConfig = await getOrderConfig()
  if (!orderConfig || !orderConfig.deliverySchedule) {
    console.error('No se pudo obtener la configuración de orden o el horario de entrega.')
    return null
  }
  const today = new Date()

  // usar hora local sin zona horaria
  console.log('Fecha de hoy:', today.toLocaleString())

  // obtener los siguientes 7 días (omitiendo hoy) con formato YYYY-MM-DD HH:mm
  const availability = []
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const nextDay = new Date(today)
    nextDay.setDate(today.getDate() + i + START_DAYS)

    const dayKey = WEEK_DAYS[nextDay.getDay()]

    // Formatear fecha usando hora local en lugar de UTC
    const year = nextDay.getFullYear()
    const month = String(nextDay.getMonth() + 1).padStart(2, '0')
    const day = String(nextDay.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`

    // obtener disponibilidad desde Facturapp
    const [error, facturappData] = await catchError(
      ShippingAvailabilityDayFacturapp.getAvailabilityDay(formattedDate, true)
    )
    // manejar error
    if (error) {
      console.error(`Error al obtener disponibilidad de Facturapp para ${formattedDate}:`, error.message)
      continue
    }

    // construir objeto de disponibilidad
    const data = {
      [formattedDate]: {
        day: dayKey,
        times: [],
      },
    }

    const times = orderConfig.deliverySchedule[dayKey]
    for (const time of times) {
      const [timeNumber] = time.split(':').map(Number)

      // buscar en los datos de Facturapp
      const facturappEntry = facturappData.find((entry) => entry.hora === timeNumber && entry.admiteMas)
      if (!facturappEntry) {
        console.log(`Franja horaria no disponible para ${formattedDate} a las ${time}:`, timeNumber)
        continue // omitir si no hay disponibilidad
      }
      data[formattedDate].times.push(time)
    }
    availability.push(data)
  }
  return availability
}
