// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

const API_KEY = '151725f4087f7ff463e513a01d683d1f';

var inputCity = document.querySelector('.search-bar');
var updateCity = document.querySelector('.city');
var updateTemp = document.querySelector('.temp');
var updateWind = document.querySelector('.wind');
var updateHumidity = document.querySelector('.humidity');
var updateForecast = document.querySelector('.forecast');
var searchCity = document.querySelector('.search-btn');
var getCity = document.querySelector('#city');

searchCity.addEventListener('click', () =>
{
  var city = getCity.value;
  getWeather(city);
})

var getWeather = (city) =>
{
  fetch('https://api.openweathermap.org/data/2.5/forecast?q='+ city + '&units=imperial&appid=' + API_KEY)
  .then((response) => response.json())
  .then((data) => this.displayWeather(data));
}

var displayWeather = (data) =>
{
  const { name } = data.city;
  const { temp, humidity } = data.list[0].main;
  const { speed } = data.list[0].wind;
  const { lat, lon } = data.city.coord;

  updateCity.innerHTML = name;
  updateTemp.innerHTML = "Temp: " + temp + "&#8457";
  updateHumidity.innerHTML = "Humidity: " + humidity + " %";
  updateWind.innerHTML = "Wind: " + speed + " MPH";
}

