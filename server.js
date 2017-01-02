const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const logger = require('morgan')
const config = require('./knexfile.js')
const env = 'development';
const knex = require('knex')(config[env])
const PORT = process.env.PORT || 3000
const app = express()
const jsonParser = bodyParser.json()

// add a middleware to validate that the params are included and redirect back to the page if not

const logpath = path.join(__dirname, './server.log')
var accessLogStream = fs.createWriteStream(logpath, {flags: 'a'})
app.use(logger('dev', {stream: accessLogStream}));
app.use(bodyParser.urlencoded({extended: false}));

const staticPath = path.join(__dirname, '/public')
app.use(express.static(staticPath));

app.get('/comments/:videoid', jsonParser, (req, res) => {
  if (!req.body) {
    res.status(400).send('Error: no videoid specified')
  } else {
    knex('comments')
    .where('videoid', req.params.videoid)
    .then(data => {
      res.status(201).json(data)
    });
  }
})

app.post('/comments', jsonParser, (req, res) => {
  console.log(req.body)
  if (!req.body) {
    return res.sendStatus(400)
  } else {
    knex.insert({
      videoid: req.body['videoid'],
      dateposted: req.body['dateposted'],
      commentstring: req.body['commentstring']
    })
    .returning(['videoid', 'dateposted', 'commentstring'])
    .into('comments')
    .then(id => {
      res.status(201).json(id[0])
    });
  }
})

app.delete('/comments/:id', jsonParser, (req, res) => {
  if (!req.body) {
    return res.sendStatus(400)
  } else {
    knex('comments')
    .returning(['videoid', 'dateposted', 'commentstring'])
    .del()
    .where('id', req.params.id)
    .then(id => {
      res.status(201).json(id[0])
    });
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
