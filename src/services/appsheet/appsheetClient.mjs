import { AppsheetClient } from 'appsheet-api'

import { ENV } from '#config/config.mjs'

// crear instancia del cliente de Appsheet
export const appsheetClient = new AppsheetClient(
  {
    appId: ENV.APPSHEET_ID,
    apiKey: ENV.APPSHEET_TOKEN,
  },
  {
    config: {
      timezone: ENV.TZ,
      maxRetriesOnRateLimit: 5,
      retryDelay: 1000,
    },
    client: {
      locale: 'en-GB',
      timezone: ENV.TZ,
    },
  }
)
