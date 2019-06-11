const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('./'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

server.listen(process.env.PORT || 1200, () => { console.log('Server is up!'); });