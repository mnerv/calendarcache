import express from 'express'
import consola from 'consola'
import cors from 'cors'
import Calendar from './router/calendar'

const PORT = 3000
const app = express()

app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(cors())

app.use('/', Calendar)

app.get('/', (req, res, next) => {
  res.sendStatus(200)
})

app.listen(PORT, () => {
  consola.ready({
    message: `Server running on http://localhost:${PORT}`,
    badge: true,
  })
})
