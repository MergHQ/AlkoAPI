const needle = require('needle');
const express = require('express');
const app = express();
const products = {};
const FS = require('fs');

const activeTime = FS.readFileSync('dump', 'utf8').split(',');

const url = (date, month) => {
  return `https://www.alko.fi/INTERSHOP/static/WFS/Alko-OnlineShop-Site/-/Alko-OnlineShop/fi_FI/Muut%20ladattavat%20tiedostot/Hinnastot/alkon-hinnasto-tekstitiedostona-${date}-${month}.txt`;
}

var restTemplate = {
  status: "",
  message: "",
  data: null
};

poll();
setInterval(poll, 3 * 60 * 1000);

function poll() {
  needle.get(url(activeTime[0], activeTime[1]), (err, res) => {

    // Update the URL for the .txt file
    if (res.statusCode === 404) {
      var date = new Date();
      activeTime[0] = date.getDate();
      activeTime[1] = date.getMonth() + 1;
      FS.writeFileSync('dump', `${date.getDate},${date.getMonth}`);
      poll();
    }

    var a = res.body.split('\n');
    a.forEach(l => {
      var parsedToArray = l.split('	');
      if (parsedToArray.length > 0) {
        var o = {};
        o['id'] = parsedToArray[0];
        o['name'] = parsedToArray[1];
        o['producer'] = parsedToArray[2];
        o['volume'] = parsedToArray[3];
        o['price'] = parsedToArray[4];
        products[parsedToArray[0]] = o;
      }
    });
  });
}

app.get('/products', (req, res) => {
  restTemplate.status = 'OK';
  restTemplate.message = '';
  restTemplate.data = products;
  res.json(restTemplate);
});

app.get('/products/:id', (req, res) => {
  if (req.params.id in products) {
    restTemplate.status = 'OK';
    restTemplate.message = '';
    restTemplate.data = products[req.params.id];
    res.json(restTemplate);
  } else {
    restTemplate.status = 'ERROR';
    restTemplate.message = 'Not found';
    restTemplate.data = null;
    res.json(restTemplate);
  }
});

app.listen(8080);