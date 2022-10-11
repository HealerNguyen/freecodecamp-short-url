require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { URLD } = require('./database/Schema')
const validator = require('validator');
// Basic Configuration
const port = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/qlkh', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((_error) => console.log('err db'))
mongoose.connection.on('error', (err) => {
  console.log('connect error', err)
})

app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  const { url } = req.body
  if (!validator.isURL(url)) return res.json({ error: 'invalid url' });
  const short_url = new Date().getTime()
  const newURL = new URLD({
    original_url: url,
    short_url
  })
  newURL.save()

  res.json({ original_url: url, short_url });
})

app.get('/api/shorturl/:url', function (req, res) {
  const { url } = req.params;
  URLD.findOne({ short_url: url }).then((url) => {
    if (!url) { throw new Error('Url is not found on database'); }
    res.redirect(url.original_url);
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
