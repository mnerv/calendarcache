const express = require('express')
const router = express.Router()
const path = require('path')
const cache = require('../middleware/rediscache')
const getCalendar = require('../functions/reqcalendar')

const { rootDir } = require('../../configs/env.config')

let link =
  'https://schema.mau.se/setup/jsp/Schema.jsp?startDatum=idag&intervallTyp=m&intervallAntal=6&sprak=SV&sokMedAND=true&forklaringar=true&resurser=p.THMMA19h'

link = 'http://localhost:4000'

function printCurrentTime() {
  const timelogRaw = new Date().toLocaleString()
  const timelog = '\x1b[34m' + timelogRaw + '\x1b[0m'

  console.log(timelog)
}

function ID() {
  return (
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 12)
  )
}

router.post('/', (req, res, next) => {
  getCalendar(req.body.link, ID()).then(val => {
    if (!val.error) {
      res.status(201).json({
        id: ID()
      })
    } else res.sendStatus(404)
  })
})

router.get('/latest.ics', (req, res, next) => {
  getCalendar(link).then((err, val) => {
    console.log(err, val)

    res.status(200).sendFile(path.join(rootDir, 'data/ics', 'latest.ics'))
  })
})

router.get('/id/:id', (req, res, next) => {
  const { id } = req.params
  let idc = id.replace(/.ics/g, '')
  res.status(200).sendFile(path.join(rootDir, 'data/ics', idc + '.ics'))
})

router.get('/test', (req, res, next) => {
  console.log(req.query)
  res.sendStatus(200)
})

router.get('/status', (req, res, next) => {
  getCalendar(link).then(value => {
    printCurrentTime()
    if (value.error) {
      console.log(
        '\x1b[31m/ / / / / / / / / / / / / ERROR / / / / / / / / / / / / /\x1b[0m'
      )
      console.log(value.error)
      console.log(
        '\x1b[31m/ / / / / / / / / / / / / ERROR / / / / / / / / / / / / /\x1b[0m'
      )
    } else {
      console.log('status code:', '\x1b[33m', value.statusCode)
    }
    let isItWorking = { msg: 'it works, I think' }
    if (value.error) isItWorking.msg = "it's not working lmao, F"
    res.status(200).json(isItWorking)
  })
})

module.exports = router
