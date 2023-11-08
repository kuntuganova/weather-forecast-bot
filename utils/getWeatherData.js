const axios = require('axios');

require('dotenv').config();
const OW_API_KEY = process.env.OW_API_KEY;

async function getWeatherData(userMsg, latitude, longitude) {
  let response;
  let data;
  let cityList = [];

  if (latitude && longitude) {
    response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OW_API_KEY}`
    );
    data = response.data;
    cityList.push({
      city: data.name,
      country: data.sys.country,
      weather: data.weather[0].description,
      temperature: (data.main.temp - 273.15).toFixed(2),
      feelsLike: (data.main.feels_like - 273.15).toFixed(2),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
    });
  } else {
    response = await axios.get(
      `https://api.openweathermap.org/data/2.5/find?q=${userMsg}&appid=${OW_API_KEY}`
    );
    data = response.data;
    cityList = data.list.map(item => {
      return {
        city: item.name,
        country: item.sys.country,
        weather: item.weather[0].description,
        temperature: (item.main.temp - 273.15).toFixed(2),
        feelsLike: (item.main.feels_like - 273.15).toFixed(2),
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        windSpeed: item.wind.speed,
      };
    });
  }

  return cityList;
}

module.exports = { getWeatherData };
