const express = require('express');
const bodyParser = require('body-parser');
const influent = require('influent');
const http = require('http');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

router.post('/influent', (req, res) => {
  console.log(req.body);

 influent
    .createHttpClient({
      server: [
        {
          protocol: "http",
          host:     "localhost",
          port:     8086
        }
      ],
      username: "gobwas",
      password: "xxxx",
      database: "training"
    })
    .then((client) => {
      for(let i=0; i < req.body.data.length; i++) {
        console.log(new Date(req.body.data[i].timestamp));
        client
          .write({
            key: 'motion',
            tags: {
              activity: req.body.data[i].activity,
              subject: req.body.data[i].subject
            },
            fields: {
              x: req.body.data[i].x,
              y: req.body.data[i].y,
              z: req.body.data[i].z,
              alpha: req.body.data[i].alpha,
              beta: req.body.data[i].beta,
              gamma: req.body.data[i].gamma,
              stamp: req.body.data[i].timestamp
            }
          })
          .then((res) => { console.log("ok")})
          .catch((error) => {
            console.log(error);
          });
      }
      res.status(200);
      res.json({ data: 'ok'});
      return res;
    });
});

router.post('/predict', (req, res) => {
  console.log(req.body);

  const data = JSON.stringify(req.body.data);

  const options = {
    hostname: '0.0.0.0',
    port: 8080,
    path: '/predict',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const request = http.request(options, (resp) => {
    console.log(`statusCode: ${resp.statusCode}`);
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(data);
      res.status(200);
      res.json({ data: data});
      return res;
    });
  });

  request.on('error', (error) => {
    console.error(error)
  });

  request.write(data);
  request.end();

});

router.get('/influent', (req, res) => {
  influent
    .createHttpClient({
      server: [
        {
          protocol: "http",
          host:     "localhost",
          port:     8086
        }
      ],
      username: "gobwas",
      password: "xxxx",

      database: "training"
    })
    .then((client) => {
      client
        .query('select * from "motion"')
        .then((result) => {
          console.log(result);
          res.status(200);
          res.json(result);
          return res;
        })
        .catch((error) => {
          console.log(error);
        });
    });
});

app.use('/', router);

app.listen(3000);

