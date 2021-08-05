let APIKey = '1cba65d3c13edbfe6f1ac567815665c2';

let today = moment().format('MM/DD/YY');

let weatherEl = $('#current-header');

//Pull in the city from the Submit Function
function getLonLat(city){

   let queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIKey;

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

    getWeather(lon, lat, cityToDisplay);
    addToLocal(cityToDisplay);


  });
}

function getWeather(lon, lat, city){

    let queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + '&exclude=hourly,minutely&units=imperial' + "&appid=" + APIKey;

    console.log(queryURL);

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
    
        $('#curr-temp').text(`Temp: ${temp}°F`);
        $('#curr-wind').text(`Wind: ${wind} MPH`);
        $('#curr-humidity').text(`Humidity: ${humidity}%`);
        $('#curr-uvi').text(`UV Index: ${uvi}`);

        let dailyForcastEl = $('#five-day')
        let dailyForcastH2 = $('<h2>')
        let dailyCardGroup = $('#daily-card-group');

        dailyForcastH2.text('5-Day Forecast');
        dailyForcastH2.attr('id', 'five-day-h2')
        dailyForcastEl.append(dailyForcastH2);

        // const htmlCard = `
        // <div class="card-top">${date[i]}</div>
        
        // `

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
            dDateEl.addClass('daily-date')
            dCardEl.append(dDateEl);

            dImgEl.attr('src', dIconURL);
            dImgEl.attr('alt', dIconAlt);
            dImgEl.addClass('daily-icon');
            dCardEl.append(dImgEl);

            dTempEl.text(`Temp: ${dTemp}°F`);
            dTempEl.addClass('daily-temp');
            dCardEl.append(dTempEl);

            dWindEl.text(`Wind: ${dWind} MPH`);
            dWindEl.addClass('daily-wind');
            dCardEl.append(dWindEl);

            dHumEl.text(`Humidity: ${dHum}%`);
            dHumEl.addClass('daily-hum');
            dCardEl.append(dHumEl);

            dCardEl.addClass('daily-card');
            dailyCardGroup.append(dCardEl);
            
        }
        

    });
}

function addToLocal(city){

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

    $('#city-list').empty();

    tempArr = JSON.parse(localStorage.getItem('previousSelection'));

    console.log(tempArr);

    let prevCityEl = $('#city-list');
    
    if(tempArr !== null){
        for (let i = 0; i < tempArr.length; i++) {

            let btnEl = $('<button>')

            btnEl.text(tempArr[i]);
            btnEl.attr('value', tempArr[i]);
            btnEl.addClass('btn btn-primary custom-city-btn col-12');
            prevCityEl.append(btnEl);

        }
    }

}

displayPrevCity();

$('#submit').click(function(event){
    event.preventDefault();
    let city = $(this).siblings('input').val()

    getLonLat(city);

})

$('.custom-city-btn').click(function(event){
    event.preventDefault();
    let city = $(this).val()

    getLonLat(city);
})