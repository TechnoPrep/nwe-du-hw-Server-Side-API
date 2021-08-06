let APIKey = '1cba65d3c13edbfe6f1ac567815665c2';

let today = moment().format('MM/DD/YY');

let weatherEl = $('#current-header');

let previousCities = document.querySelector(".custom-city-btn");

//Pull in the city from the Submit Function
function getLonLat(city, unit){

   let queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

   console.log(queryURL);

   fetch(queryURL)
  .then(function (response) {
      
    if(response.status !== 200){
          //response
      } else {
        return response.json();
      }
    
  })
  .then(function (data) {

    let lat = data.coord.lat;
    let lon = data.coord.lon;

    let cityToDisplay = data.name;

    console.log('I got the city');

    getWeather(lon, lat, cityToDisplay, unit);
    addToLocal(cityToDisplay);

  });
}

function uvIndex(uvi){

    if(uvi < 3){
        $('#uvIndex').toggleClass('uvi-low');
        console.log('low');
    
    }else if(uvi < 6 && uvi > 3){
        $('#uvIndex').toggleClass('uvi-moderate');
        console.log('moderate');
    
    } else if(uvi < 8 && uvi > 5){
        $('#uvIndex').toggleClass('uvi-high');
        console.log('high');

    }  else if(uvi < 11 && uvi > 7){
        $('#uvIndex').toggleClass('uvi-vhigh');
        console.log('vhigh');

    } else {
        $('#uvIndex').toggleClass('uvi-extreme');
        console.log('extreme');
    }
}

function getWeather(lon, lat, city, unit){

    let queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + '&exclude=hourly,minutely&units=' + unit + "&appid=" + APIKey;

    console.log(queryURL);

    console.log('I got the Fetch');

    fetch(queryURL)
    .then(function (response){
        return response.json();
    })

    .then(function (data){

        $('#five-day-h2').remove();
        $('.daily-card').remove();

        let weatherIcon = $('<img>');
        
        let iconCode = data.current.weather[0].icon;
        let iconURL = 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png'
        let iconAlt = data.current.weather[0].description;
    
        let temp = data.current.temp;
        let wind = data.current.wind_speed;
        let humidity = data.current.humidity;
        let uvi = data.current.uvi;

        weatherEl.text(`${city} (${today})`);
    
        weatherIcon.attr('src', iconURL);
        weatherIcon.attr('alt', iconAlt);
        weatherIcon.addClass('currentIcon');
    
        weatherEl.append(weatherIcon);

        let spanEl = $('<span>');

        let degrees = unit === 'imperial' ? 'F' : 'C';
        let speed = unit === 'imperial' ? 'MPH' : 'm/s';

        $('#curr-temp').text(`Temp: ${temp}°${degrees}`);
        $('#curr-wind').text(`Wind: ${wind} ${speed}`);
        $('#curr-humidity').text(`Humidity: ${humidity}%`);
        $('#curr-uvi').text(`UV Index: `);

        spanEl.text(uvi);
        spanEl.attr('id', 'uvIndex');
        $('#curr-uvi').append(spanEl);

        let dailyForcastEl = $('#five-day')
        let dailyForcastH2 = $('<h2>')
        let dailyCardGroup = $('#daily-card-group');

        dailyForcastH2.text('5-Day Forecast');
        dailyForcastH2.attr('id', 'five-day-h2')
        dailyForcastEl.append(dailyForcastH2);

        uvIndex(uvi);

        for (let i = 1; i < 6; i++) {
            
            let dCardEl = $('<ul>');
            let dDateEl = $('<li>');
            let dImgEl = $('<img>');
            let dTempEl = $('<li>');
            let dWindEl = $('<li>');
            let dHumEl = $('<li>');

            let dDate = moment.unix(data.daily[i].dt).format('MM/DD/YYYY');
            let dIconCode = data.daily[i].weather[0].icon;
            let dIconURL = 'http://openweathermap.org/img/wn/' + dIconCode + '@2x.png';
            let dIconAlt = data.daily[i].weather.description;
            let dTemp = data.daily[i].temp.day;
            let dWind = data.daily[i].wind_speed;
            let dHum = data.daily[i].humidity;
            
            dDateEl.text(dDate);
            dDateEl.addClass('daily-date');
            dCardEl.append(dDateEl);

            dImgEl.attr('src', dIconURL);
            dImgEl.attr('alt', dIconAlt);
            dImgEl.addClass('daily-icon d-flex justify-content-center');
            dCardEl.append(dImgEl);

            dTempEl.text(`Temp: ${dTemp}°${degrees}`);
            dTempEl.addClass('daily-temp');
            dCardEl.append(dTempEl);

            dWindEl.text(`Wind: ${dWind} ${speed}`);
            dWindEl.addClass('daily-wind');
            dCardEl.append(dWindEl);

            dHumEl.text(`Humidity: ${dHum}%`);
            dHumEl.addClass('daily-hum');
            dCardEl.append(dHumEl);

            dCardEl.addClass('daily-card');
            dailyCardGroup.append(dCardEl);
            
        }
        
        console.log('I displayed the data');
        

    });
}

function addToLocal(city){

    console.log('addToLocal Ran');
    let cityArr = [];

    cityArr = JSON.parse(localStorage.getItem('previousSelection')) || [];

    cityArr.push(city);

    let uniqueCity = cityArr.filter((c, index) =>{
        return cityArr.indexOf(c) === index;
    });

    localStorage.setItem('previousSelection', JSON.stringify(uniqueCity));

    displayPrevCity();

}

function displayPrevCity(){

    console.log('displayPrevCity Ran');

    $('#city-list').empty();

    tempArr = JSON.parse(localStorage.getItem('previousSelection'));

    let prevCityEl = $('#city-list');
    
    if(tempArr !== null){
        for (let i = 0; i < tempArr.length; i++) {

            let btnEl = $('<button>');

            btnEl.text(tempArr[i]);
            btnEl.attr('value', tempArr[i]);
            btnEl.attr('type', 'button');
            btnEl.addClass('btn btn-primary custom-city-btn col-12');
            prevCityEl.append(btnEl);

        }
    }

}

displayPrevCity();

$('#submit').on('click',function(e){
    e.preventDefault();
    let city = $('#City').val()

    let unit = $('input[type=radio][name=unitType]:checked').val();

    getLonLat(city, unit);

})


$(document).ready(function () {
    
    $(document).on('click', '.custom-city-btn', function(e){

        e.preventDefault();
        let city = $(this).val();
        let unit = $('input[type=radio][name=unitType]:checked').val();
    
        console.log('I clicked');
        console.log(city);
        getLonLat(city, unit);


    })

});