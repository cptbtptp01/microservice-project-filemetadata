require('dotenv').config()

// packages
const express = require('express');
const cors = require('cors');

// connect to database
const db = require('./db');

// routes
const fileRoutes = require('./routes/fileRoutes');

// fcc
const app = express();
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// define routes
app.use('/api/fileanalyse', fileRoutes);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});