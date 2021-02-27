const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;
const WEATHER_KEY = process.env.WEATHER_KEY;
const MAPBOX_KEY = process.env.MAPBOX_KEY;

app.use(express.static('public'));
app.listen(PORT);

//Displayer and listener
// app.get('*', (req, res) => {
//     res.send('No se encuentra la aplicacion de clima');
// })

app.get('/secrets', (req, res) => {
    res.send({
        MAPBOX_KEY: WEATHER_KEY,
        WEATHER_KEY: MAPBOX_KEY
    })
})

console.log('App running on ' + PORT)