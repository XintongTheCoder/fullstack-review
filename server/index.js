const getReposByUsername = require('../helpers/github').getReposByUsername;
const db = require('../database');
const path = require('path');
const express = require('express');
let app = express();
let cors = require('cors');
app.use(cors());
// To encode req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Set up static file service for files in the `client/dist` directory.
// Webpack is configured to generate files in that directory
app.use(express.static(path.join(__dirname, '../client/dist')));

app.post('/repos', (req, res) => {
  // This route should take the github username provided
  // and get the repo information from the github API, then
  // save the repo information in the database
  getReposByUsername(req.body.username)
    .then((res) => db.save(res.data))
    .then((summary) => {
      return {
        ...summary,
        repos: db.findTop25(),
      };
    })
    .then((resp) => res.status(201).json(resp))
    .catch((err) => {
      res.sendStatus(404);
    });
});

app.get('/repos', function (req, res) {
  // This route should send back the top 25 repos
  db.findTop25()
    .then((repos) => {
      res.status(200).json(repos);
    })
    .catch((err) => {
      res.sendStatus(404);
    });
});

let port = 1128;

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
