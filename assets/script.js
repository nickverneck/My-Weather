const Key = "a9fa77728037e192b8f04d8e30599ccc";
// lets make sure the document is ready before we start playing with Jquery
$('document').ready(function()
{
//lets create a function to check if we have values on local Storage
// if we do we populate the page with it's current values 
function loadLocalStorage()
{
    if (localStorage.length > 0)
    {
      var cities = JSON.parse(localStorage.getItem("cities"));
      console.log(cities);
    }
}

// we need a function for the btn-search
// this function will prevent the form to be sent 
// then it will catch the value for the city and put into a string with the api required URL
// once we receive a response we will get the datas value we need to populate our page
// we will also add the city into local storage for future reference
// keep in mind units are currently in Imperial

function search(event){
    event.preventDefault()
    var city = $('.text-search').val();
    var query = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+Key+'&units=imperial';
    
    var queryForecast = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+Key+'&units=imperial';
    fetch(query)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
          $('.weatherDiv').css("display","flex");
        $('#city').text(data.name);
        $('#temp').text(Math.floor(data.main.temp)+'°F');
        $('#wind').text("Wind Speed: "+Math.floor(data.wind.speed));
        $('#humidity').text("Humidity: "+Math.floor(data.main.humidity));
        console.log(data)
        timezone = data.timezone/60;
        var date = moment().utcOffset(timezone).format("dddd D MMMM YYYY");
        $('#date').text(date);
        // everything we needed has been loaded, now let's  do another fetch to grab the UV index and the forecast for the next 5 days.
        var queryUV = 'https://api.openweathermap.org/data/2.5/onecall?lat='+data.coord.lat+'&lon='+data.coord.lon+'&appid='+Key+'&units=imperial';
        fetch(queryUV)
        .then(function (response2) {
            return response2.json();
          })
          .then(function (data2) {
              console.log(data2)
             $('#uv').text("UV index:"+Math.floor(data2.current.uvi));
            // we are going to write the code now to fill up the 5 days forecast
            $('.weekWeather').css("display","flex");
            var divParent = document.querySelectorAll('.card-body');
            for (i=0 ; i< divParent.length; i++)
            {
                // Day
                divParent[i].children[0].textContent = moment.unix(data2.daily[i].dt).format("ddd");
                // temp
                divParent[i].children[1].textContent = Math.floor(data2.daily[i].temp.day)+"°F";
                //wind speed
                divParent[i].children[2].textContent = "wind: "+Math.floor(data2.daily[i].wind_speed);
                // humidty
                divParent[i].children[3].textContent = "humidity: "+Math.floor(data2.daily[i].humidity);
            }
          })
    




      });
    

}
loadLocalStorage();
$('.btn-search').on('click',search)
})