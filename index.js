
const CORS = require("fastify-cors")
const JWT = require('fastify-jwt')
const LOGGER = require('fastify-log')
const FASTIFYKNEX = require('fastify-knexjs')
const config = require('./api/config/appconfig')
const routes = require('./api/routes')
const utils = require('./api/plugins/utilities')
const fastify = require('fastify')({
  logger: config.app.log_debug
})

fastify.register(CORS, {
  origin: true
}).register(JWT, {
  secret: config.app.jwt_secret
}).register(LOGGER)
  .decorate("authenticate", async function (request, reply) {
    try {
      console.log(`before authenticat.. ${config.app.jwt_secret}`)
      let decoded = await request.jwtVerify()
      // await check.validateUser(decoded,reply)      
    } catch (err) {
      reply.send(err)
    }
  })
  .decorate('appconfig', config)
  .decorate("hmutils", utils)
  .register(FASTIFYKNEX, config.databases.pg)
  // .after(async (err) => {
  //   if (err) {
  //     throw err;
  //   }
  //   await dbtest()
  // })
  .register(routes)

const dbtest = async () => {
  try {

    const r = await fastify.knex.raw('select (1+3) as result')
    // console.log(r.rows[0])
    console.log("sql successfully registered using knex")
  } catch (e) {
    console.error(`----------- do something --------------`, e)
    process.exit(1)
  }
}


// Run the server!
const start = async () => {
  try {
    await fastify.listen(config.app.app_port, '0.0.0.0')
    console.log(`server ${config.app.app_version} ready to listen ${config.app.app_port} `)
  } catch (err) {
    console.error(err)
    fastify.log.error(err)
    process.exit(1)
  }
}

start();