require('dotenv-safe').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
const app = express()
const i18n = require('i18n')
const initMongo = require('./config/mongo')
const path = require('path')
const jade = require('jade')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const https = require('https')
const http = require('http')
const controller = require('./app/controllers/mediaHouse')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swaggerjson.json')
const options = {
  key: fs.readFileSync(
    '/etc/letsencrypt/live/uat.presshop.live/privkey.pem',
    'utf8'
  ),
  cert: fs.readFileSync(
    '/etc/letsencrypt/live/uat.presshop.live/fullchain.pem',
    'utf8'
  ),
  ca: fs.readFileSync(
    '/etc/letsencrypt/live/uat.presshop.live/chain.pem',
    'utf8'
  )
}
// Setup express server port from ENV, default: 3000
app.set('port', process.env.PORT || 3000)

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Redis cache enabled by env variable
if (process.env.USE_REDIS === 'true') {
  const getExpeditiousCache = require('express-expeditious')
  const cache = getExpeditiousCache({
    namespace: 'expresscache',
    defaultTtl: '1 minute',
    engine: require('expeditious-engine-redis')({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    })
  })
  app.use(cache)
}

app.post(
  '/mediaHouse/webhook',
  // trimRequest.all,
  express.raw({ type: 'application/json' }),
  // requireAuth,
  controller.webhook
)

// for parsing json
app.use(
  bodyParser.json({
    limit: '20mb'
  })
)
// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true
  })
)
app.use('/user', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// i18n
i18n.configure({
  locales: ['en', 'es'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
  objectNotation: true
})
app.use(i18n.init)

// Init all other stuff
app.use(cors())
app.use(passport.initialize())
app.use(compression())
app.use(helmet())
app.use(fileUpload())
app.engine('ejs', require('ejs').renderFile)
app.set('view engine', 'ejs')
app.use(require('./app/routes/index'))
// app.listen(app.get('port'))

// app.listen(app.get('port'))

const httpsServer = https.createServer(options, app)

httpsServer.listen(app.get('port'), () => {
  console.log(`SERVER running on port no : ${app.get('port')}`)
})
// Init MongoDB
initMongo()

module.exports = app // for testing
