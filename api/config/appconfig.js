'use strict'

require('dotenv').config()
const fs = require('fs')

const APP_VERSION = '0.0.1'
const LOG_LEVEL = process.env.LOGLEVEL ? process.env.LOGLEVEL : 'error'
const SQL_HOST = process.env.DB_HOST
const SQL_PORT = process.env.DB_PORT
const SQL_USER = process.env.DB_USER
const SQL_PASS = process.env.DB_PASS
const SQL_SCHEMA = process.env.DB_NAME
let SQL_SSL = true
const SQL_DEBUG = process.env.DB_DEBUG ? process.env.DB_DEBUG : false
const BASE_URL = 'http://localhost:3000'

const appconfig = {
    app: {
        app_port: process.env.APP_PORT,
        jwt_secret: process.env.JWT_SECRET,
        app_version: APP_VERSION,
        JWT_EXPIRY_SECS: process.env.JWT_EXPIRY_SECS,
        log_debug: LOG_LEVEL,
        base_url:BASE_URL
    },
    databases: {
        pg: {
            client: 'pg',
            debug: SQL_DEBUG,
            connection: {
                host: SQL_HOST,
                port: SQL_PORT,
                user: SQL_USER,
                password: SQL_PASS,
                database: SQL_SCHEMA
            },
            searchPath: ['nanomyt', 'public']
        },
    }
}

module.exports = appconfig;