const express = require('express')
const bodyParser = require('body-parser')
const config = require('./knexfile.js')
const env = 'development';
const knex = require('knex')(config[env])
const PORT = process.env.PORT || 3000
const app = express()
const jsonParser = bodyParser.json()


app.get('/comments/:videoid', jsonParser, (req, res) => {
  if (!req.body) {
    return res.sendStatus(400)
  } else {
    knex('comments')
    // .returning(['videoid', 'dateposted', 'commentstring'])
    .where('videoid', req.params.videoid)
    .then(data => {
      res.status(201).json(data)
    });
  }
})

// knex('comments').where('videoid', req.params.videoid)

// app.post('/comments', jsonParser, (req, res) => {
//   if (!req.body) {
//     return res.sendStatus(400)
//   } else {
//     knex.insert({
//       name: req.body['name']
//     })
//     .returning(['id', 'name'])
//     .into('authors')
//     .then(id => {
//       res.status(201).json(id[0])
//     });
//   }
// })

// app.put('/comments/:id', jsonParser, (req, res) => {
//   if (!req.body) {
//     return res.sendStatus(400)
//   } else {
//     knex('authors')
//     .returning('name')
//     .update({
//       name: req.body['name']
//     })
//     .where('id', req.params.id)
//     .then(name => {
//       res.status(201).json(name[0])
//     });
//   }
// })

// app.delete('/comments/:id', jsonParser, (req, res) => {
//   if (!req.body) {
//     return res.sendStatus(400)
//   } else {
//     knex('authors')
//     .returning(['id', 'name'])
//     .del()
//     .where('id', req.params.id)
//     .then(id => {
//       res.status(201).json(id[0])
//     });
//   }
// })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
