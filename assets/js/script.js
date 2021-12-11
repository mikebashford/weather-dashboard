const API_KEY = '151725f4087f7ff463e513a01d683d1f';

var searchCities = JSON.parse(localStorage.getItem('citiesArray')) || [];

var saveSearches = (cityName) =>
{
  searchCities.push(cityName);
  localStorage.setItem('citiesArray', JSON.stringify(searchCities));
  
  if(searchCities.length <= 1)
  {
    var dividerEl = document.createElement('hr');
    $(dividerEl).addClass('rounded');
    $('.search-bar').append(dividerEl);
  }

  var buttonEl = document.createElement('button');
  $(buttonEl).addClass('saved-city');
  buttonEl.innerHTML = cityName;
  $('.search-bar').append(buttonEl);
}

$('.search-btn').on('click', function()
{
  var city = $('#city').val();
  saveSearches(city);
  getWeather(city);
})

var getWeather = (city) =>
{
  fetch('https://api.openweathermap.org/data/2.5/forecast?q='+ city + '&units=imperial&appid=' + API_KEY)
  .then((response) => response.json())
  .then((data) =>
  {
    var { lat, lon } = data.city.coord;
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&exclude=hourly&minutely&appid='+ API_KEY)
    .then((response) => response.json())
    .then((data) => 
    {
      $('.city').text(city);
      var {temp, humidity, wind_speed, uvi} = data.current;
      var {icon} = data.current.weather[0];

      $('.temp').text('Temp: ' + temp + ' °F');
      $('.wind').text('Wind: ' + wind_speed + ' MPH');
      $('.humidity').text('Humidity: ' + humidity + ' %');
      $('.uvi').text("UV index: " + uvi);
      $('.weather-icon').attr('src', 'https://openweathermap.org/img/wn/' + icon + '@2x.png');
    });
  });
}




