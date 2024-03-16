const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
/* Variables */
let cityName = '--';
let city = [];
let lat = '--', lon = '--';
let sunrise = '--',sunset = '--',temperature = '--',humidity = '--',weather = '--',feelsLike = '--',seaLevelPressure = '--',visibility = '--',windSpeed = '--',windDirection = '--',cloud = '--';
let forecastList;
app.get('/', (req, res) => {
  res.render('pages/index', { cityName: cityName, lat: lat, lon: lon, riseTime:sunrise, setTime:sunset,temperature: temperature,feelsLike: feelsLike,humidity: humidity,weather: weather,pressure: seaLevelPressure, windSpeed:windSpeed,windDirection:windDirection, cloud:cloud,visibility:visibility,forecastList:forecastList,});
});

app.post('/', (req, res) => {
  cityName = req.body.cityName;
  city.push(cityName);
  let url = 'https://api.weatherapi.com/v1/forecast.json?key=75efa4ecef444031b8b162156241403&q='+cityName+'&days=8&aqi=yes&alerts=yes';
  https.get(url, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      weatherData = JSON.parse(data);
      lat = weatherData.location.lat;
      lon = weatherData.location.lon;
      if (weatherData.forecast && weatherData.forecast.forecastday && weatherData.forecast.forecastday.length > 0) {
        const firstDayForecast = weatherData.forecast.forecastday[0];
        sunrise = firstDayForecast.astro.sunrise;
        sunset = firstDayForecast.astro.sunset;
        forecastList = weatherData.forecast.forecastday;
      } else {
        console.error('Error: Could not retrieve forecast data for the first day.');
        sunrise = null;
        sunset = null;
        forecastList = null;
      }
      temperature = weatherData.current.temp_c;
      humidity = weatherData.current.humidity;
      weather = weatherData.current.condition.text;
      feelsLike = weatherData.current.feelslike_c;
      seaLevelPressure= weatherData.current.pressure_mb;
      cloud = weatherData.current.cloud;
      visibility = weatherData.current.vis_km;
      windSpeed = weatherData.current.wind_kph;
      windDirection = weatherData.current.wind_dir;
      
      res.redirect('/');
    });
  }).on('error', (e) => {
    console.error(e);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  
});
