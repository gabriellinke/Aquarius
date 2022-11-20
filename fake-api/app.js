const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
const port = 3000;

function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

app.get('/', (request, response) => {
  return response.json({
    temperatura: getRandomFloat(20, 30, 2),
    ph: getRandomFloat(5, 9, 2)
  })
})

app.post('/update-info', (request, response) => {
  console.log(request.body);
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'key=AAAA9FpWgyU:APA91bFXbera0I3OPrfVGrcXvauVglB6l69VPdqm6Y-uqptf5M22STJngg6GyX5AA0YigqKmam2-WR6pfqtc_iuLf0jprzSpPSf1Gtp9brUC414FB7kJ5FjgniW9SLADS-UGusPThZco'
  }
  axios.post('https://fcm.googleapis.com/fcm/send', request.body, {headers: headers})
    .then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err);
    })
  // console.log(request.headers);
  return response.sendStatus(200);
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
