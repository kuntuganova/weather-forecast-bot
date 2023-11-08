function formatWeatherMessage(weatherData, weatherEmoji) {
  const {
    city,
    weather,
    temperature,
    feelsLike,
    humidity,
    pressure,
    windSpeed,
  } = weatherData;

  return `${weatherEmoji} The weather in <b>${city}</b> is <i>${weather}</i> with a temperature of <b>${temperature}°C</b>.
    <b>Feels like:</b> ${feelsLike}°C
    <b>Humidity:</b> ${humidity}% 💧
    <b>Pressure:</b> ${pressure}hPa 🌡️
    <b>Wind Speed:</b> ${windSpeed}m/s 🌬️`;
}

module.exports = { formatWeatherMessage };
