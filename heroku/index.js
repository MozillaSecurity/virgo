/** @format */

const fs = require('fs')
const express = require('express')

const app = express()

const port = process.env.PORT || 443

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', (req, res) => res.send('Virgo'))

app.get('/tasks', function(req, res) {
  fs.readFile('./tasks.json', (err, json) => {
    const obj = JSON.parse(json)
    res.json(obj)
  })
})

app.listen(port, () => {
  console.log(`Task Definition Server is listening on port ${port}.`)
})
