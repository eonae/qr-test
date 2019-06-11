const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const app = express();

app.use(express.static('./'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

const server = https.createServer({
  key: fs.readFileSync('./certificate/server_cert.key'),
  cert: fs.readFileSync('./certificate/server_cert.pem'),
  passphrase: 'farcajst'
}, app);

server.listen(1200, () => { console.log('Server is up!'); });