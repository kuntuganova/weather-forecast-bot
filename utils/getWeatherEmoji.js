function getWeatherEmoji(weather) {
  if (weather.includes('cloud')) {
    return '☁️';
  }
  if (weather.includes('rain')) {
    return '🌧️';
  }
  if (weather.includes('sun') || weather.includes('clear')) {
    return '☀️';
  }
  if (weather.includes('snow')) {
    return '❄️';
  }
  return '🌫️';
}

module.exports = { getWeatherEmoji };
