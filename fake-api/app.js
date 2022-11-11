const express = require('express');
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
  return response.sendStatus(200);
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
