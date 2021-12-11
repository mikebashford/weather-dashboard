const API_KEY = '151725f4087f7ff463e513a01d683d1f';

var searchCities = JSON.parse(localStorage.getItem('citiesArray')) || [];
var numberOfCards = 5;

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
      
      var {temp, humidity, wind_speed, uvi, dt} = data.current;
      var {icon} = data.current.weather[0];

      var date = new Date(dt * 1000).toLocaleDateString();

      $('.city').text(city + " " + date);
      $('.temp').text('Temp: ' + temp + ' °F');
      $('.wind').text('Wind: ' + wind_speed + ' MPH');
      $('.humidity').text('Humidity: ' + humidity + ' %');
      $('.uvi').text("UV index: " + uvi);
      $('.weather-icon').attr('src', 'https://openweathermap.org/img/wn/' + icon + '.png');

      for(i = 0; i < numberOfCards; i++)
      {
        var dateEl = document.createElement('p');
        var iconEl = document.createElement('img');
        var tempEl = document.createElement('p');
        var windEl = document.createElement('p');
        var humidEl = document.createElement('p');
        var {max} = data.daily[i].temp; 
        var {wind_speed, humidity} = data.daily[i];
        var {dt} = data.daily[i+1];
        var {icon} = data.daily[i].weather[0];

        var date = new Date(dt * 1000).toLocaleDateString();

        console.log(date, max, wind_speed, humidity, icon);

        $(dateEl).text(date);
        $(tempEl).text('Temp: ' + max + ' °F');
        $(windEl).text('Wind: ' + wind_speed + ' MPH');
        $(humidEl).text('Humidity: ' + humidity + ' %');
        $(iconEl).attr('src', 'https://openweathermap.org/img/wn/' + icon + '.png');

        $('.card' + i).append(dateEl, iconEl, tempEl, windEl, humidEl);
      }
    })
  })
}





