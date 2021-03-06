//API key string so I don't have to type it twice
const API_KEY = '151725f4087f7ff463e513a01d683d1f';
//How many forecast cards I want to create
var numberOfCards = 5;
var savedCities = JSON.parse(localStorage.getItem('cities')) || [];

//Button that allows us find the weather when a city is entered
$('.search-btn').on('click', function()
{
  clearPreviousData();
  var city = $('#city').val();
  if( city !== null && city !== "" && city !== " ")
  {
    $('#city').val(" ");
    getWeather(city);
    saveSearches(city);
  }
})
//Gets the weather by city, converts to lat/lon, gets the needed forecast items
var getWeather = (city) =>
{
  fetch('https://api.openweathermap.org/data/2.5/forecast?q='+ city + '&units=imperial&appid=' + API_KEY)
  .then((response) => response.json())
  .then((data) =>
  {
    //use the lat/lon to grab the rest of the data
    var { lat, lon } = data.city.coord;
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&exclude=hourly&minutely&appid='+ API_KEY)
    .then((response) => response.json())
    .then((data) => 
    {
      //create the variable to grab the data from api
      var {temp, humidity, wind_speed, uvi, dt} = data.current;
      var {icon} = data.current.weather[0];
      var date = new Date(dt * 1000).toLocaleDateString();
      var weatherIconEl = document.createElement('img');
      var uvIndexEl = document.createElement('button');
      uvIndexEl.textContent = uvi;
      //test the uvi to determine which class to add to the button
      if( uvi <= 2)
      {
        $(uvIndexEl).addClass('uv-safe')
      }
      else if( uvi > 2 && uvi <= 7)
      {
        $(uvIndexEl).addClass('uv-moderate')
      }
      else
      {
        $(uvIndexEl).addClass('uv-danger')
      }
      //update all the data on the web page
      $(weatherIconEl).attr('src', 'https://openweathermap.org/img/wn/' + icon + '.png');
      $('.city').text(city + " " + date);
      $('.icon-column').append(weatherIconEl);
      $('.temp').text('Temp: ' + temp + ' ??F');
      $('.wind').text('Wind: ' + wind_speed + ' MPH');
      $('.humidity').text('Humidity: ' + humidity + ' %');
      $('.uvi').text("UV index: ").append(uvIndexEl); 
      //create the 5 day forecast cards and insert the data
      for(i = 0; i < numberOfCards; i++)
      {
        var dateEl = document.createElement('p');
        var iconEl = document.createElement('img');
        var tempEl = document.createElement('p');
        var windEl = document.createElement('p');
        var humidEl = document.createElement('p');
        var {max} = data.daily[i+1].temp; 
        var {wind_speed, humidity, dt} = data.daily[i+1];
        var {icon} = data.daily[i+1].weather[0];
        var date = new Date(dt * 1000).toLocaleDateString();

        $(dateEl).text(date);
        $(tempEl).text('Temp: ' + max + ' ??F');
        $(windEl).text('Wind: ' + wind_speed + ' MPH');
        $(humidEl).text('Humidity: ' + humidity + ' %');
        $(iconEl).attr('src', 'https://openweathermap.org/img/wn/' + icon + '.png');
        $('.card' + i).append(dateEl, iconEl, tempEl, windEl, humidEl);
        $('.card' + i).attr('style', 'visibility:visible;')
      }
    })
  })
}

//Saves all the information from the previous search
var saveSearches = (cityName) =>
{
  savedCities.push(cityName);
  localStorage.setItem('cities', JSON.stringify(savedCities));
  if(savedCities.length <= 1)
  {
    var dividerEl = document.createElement('hr');
    $(dividerEl).addClass('rounded');
    $('.search-bar').append(dividerEl);
  }
  var buttonEl = document.createElement('button');
  $(buttonEl).addClass('saved-city');
  buttonEl.innerHTML = cityName;
  $('.search-bar').append(buttonEl);

  $(buttonEl).on('click', function()
  {
    clearPreviousData();
    getWeather(cityName);
  })
}

//Clears the data from the previous search
var clearPreviousData = () =>
{
  $('.row').empty();
  for(i = 0; i < numberOfCards; i++)
  {
    var colEl = document.createElement('div');
    $(colEl).addClass('column');
    var cardEl = document.createElement('div');
    $(cardEl).addClass('card'+ i);
    $(colEl).append(cardEl);
    $('.row').append(colEl);
  }
  $('.icon-column').empty();
}

localStorage.clear();
