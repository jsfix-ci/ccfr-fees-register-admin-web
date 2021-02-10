#!/usr/bin/env node
import * as config from 'config'

import * as secrets from 'modules/secrets'
secrets.setup(config)
import { app } from './app'
import { AppInsights } from './app-insights/app-insights'

// App Insights needs to be enabled as early as possible as it monitors other libraries as well
AppInsights.enable()

const port: string = process.env.PORT || '3000'

app.listen(port, () => {
  console.log(`Application started: http://localhost:${port}`)
})
