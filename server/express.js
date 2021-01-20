import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'

// modules for server side rendering
import React from 'react'
import userRoutes from '/api/routes/user.routes'
import authRoutes from '/api/routes/auth.routes'
import postRoutes from '/api/routes/post.routes'

import devBundle from './devBundle'
import config from '/config/config'
import ServerSideMainPage from "../frontend/ServerSideMainPage";

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

if (config.env === "development") {
    devBundle.compile(app)
}
// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
app.use(cors())

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', postRoutes)

app.get('*', ServerSideMainPage)

// Catch unauthorised errors
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ "error": err.name + ": " + err.message })
    } else if (err) {
        res.status(400).json({ "error": err.name + ": " + err.message })
        console.log(err)
    }
})

export default app
