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
      var localCities = JSON.parse(localStorage.getItem("cities"));
    //   inverted loop values to retrive the lastest search to older
    var index =localCities.cities.length -1;
      for (i = index; i >= 0;i--)
      {
          var liEl = document.createElement("li");
          $(liEl).text(localCities.cities[i]);
          $(liEl).attr("class","list-group-item")
          $('.list-group').append(liEl)
         
      }
      search(localCities.cities[index])
    }
}

// we need a function for the btn-search
// this function will prevent the form to be sent 
// then it will catch the value for the city and put into a string with the api required URL
// once we receive a response we will get the datas value we need to populate our page
// we will also add the city into local storage for future reference
// keep in mind units are currently in Imperial

function search(city){
  
    var query = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+Key+'&units=imperial';
    
    var queryForecast = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+Key+'&units=imperial';
    fetch(query)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var icon = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
          $('.weatherDiv').css("display","flex");
        $('#city').text(data.name);
        $('#temp').text(Math.floor(data.main.temp)+'°F');
        $('#wicon').attr("src",icon);
        $('#wind').text("Wind Speed: "+Math.floor(data.wind.speed));
        $('#humidity').text("Humidity: "+Math.floor(data.main.humidity));
       
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
             
             $('#uv').text("UV index: "+Math.floor(data2.current.uvi));
            // we are going to write the code now to fill up the 5 days forecast
            $('.weekWeather').css("display","flex");
            var divParent = document.querySelectorAll('.card-body');
            for (i=0 ; i< divParent.length; i++)
            {
                var iconurl = "http://openweathermap.org/img/w/" + data2.daily[i].weather[0].icon + ".png";
                // Day
                divParent[i].children[0].textContent = moment.unix(data2.daily[i].dt).format("ddd");
                // temp
                divParent[i].children[1].textContent = Math.floor(data2.daily[i].temp.eve)+"°F";
                // icon
                $(divParent[i].children[2]).attr('src', iconurl);
                //wind speed
                divParent[i].children[3].textContent = "wind: "+Math.floor(data2.daily[i].wind_speed);
                // humidty
                divParent[i].children[4].textContent = "humidity: "+Math.floor(data2.daily[i].humidity);
            }
          })
        //   now that all data is loaded to the page Let's add the city to local storage 
        // that way when user comes back we have a list of cities for the user
        // so first we check if local storage has any entry 
        // if it does we will check if the city is already in storage
        // if its a new entry we add to local storage
        
       
         if (localStorage.length>0)
         {
            var localCities =JSON.parse(localStorage.getItem("cities"));
             if (!localCities.cities.includes(data.name))
             {
            
            localCities.cities.push(data.name)
            
            localStorage.setItem("cities", JSON.stringify(localCities));
            }
         }
         else
         {
            var currentCity = {
                cities: [data.name]} 
                localStorage.setItem("cities", JSON.stringify(currentCity));
         }
    




      });
    

}
loadLocalStorage();
$('.btn-search').on('click',function( event ) {
    event.preventDefault();
    var city = $('.text-search').val();
    search(city);
}

)
$('.list-group').on('click',function( event ) {
    if (event.target.classList.contains('list-group-item'))
     {
    var city = event.target.textContent;
    search(city);
     }
}

)
})