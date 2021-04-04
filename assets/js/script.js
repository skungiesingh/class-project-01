var contentBoxEl = document.querySelector("#content-box")
var forecastBoxEl = document.querySelector("#forecast_box")
var cityInputEl = document.querySelector("#cityInput")
var userFormEl = document.querySelector("#user-form")
var searchHistoryEl = document.querySelector("#search-history")
var cityNameHolder = []




//init cityNameArray
var cityNameArray = JSON.parse(localStorage.getItem("cityNameArray"));
    // //init homepage if none exist in local storage
    if(!cityNameArray){
        cityNameArray = []
        getCityInfo("Melbourne");
    } else {
        getCityInfo(cityNameArray[cityNameArray.length-1])
        searchHistoryBtns();
    }

//time converter (time is received from api as a unix code)
function timeConverter (inputTime) {
let unix_timestamp = inputTime;
var date = new Date(unix_timestamp * 1000)
var day = date.getDate();
var month = date.getMonth();
var year = date.getFullYear()-2000;

//format time
var formattedTime = month + "/" + day + "/" + year;
return formattedTime
}


//parse lat lon from city input
function getCityInfo (city) {
    // format openweather api
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=27a6e74d4260774945191a8dc4b750e0&units=imperial"

    //make request to url
    fetch(apiUrl)
    .then(function(response){
        if(response.ok){
            return response.json()
        } else {
            alert("Error: Please Enter Valid City")
            getCityInfo(cityNameArray[cityNameArray.length-1])
        }
    })
    .then(function(data){
        var cityLat = data.coord.lat;
        var cityLon = data.coord.lon;
        var requestName = data.name;
        
        //send info
        cityUvInfo (cityLat, cityLon, requestName);

        //to get the same name regardless of user input
        localStorageHolder(requestName);
        cityNameHolder = requestName;
    });
};

//main content builder
function cityUvInfo (lat, lon, requestName) {
    //format request to url
    debugger;

    const lt = 60.936;
    const lg = 5.114;

    var oneUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +  "&appid=27a6e74d4260774945191a8dc4b750e0&units=imperial"
    var stormApi = "https://api.stormglass.io/v2/tide/extremes/point?lat=" + lat + "&lng=" + lon;
    var cityName = requestName;

    fetch(stormApi, {
  headers: {
    'Authorization': 'a6c43a5a-9523-11eb-a242-0242ac130002-a6c43adc-9523-11eb-a242-0242ac130002'
  }
    }).then((response) => response.json()).then((jsonData) => {
    console.log(jsonData)
    });

    //make request to api
    fetch(oneUrl).then(function(response){
        return response.json()
    })
    .then(function(data){

        // //today object
        // var today = {
        //     Date: timeConverter(data.current.dt),
        //     Temp: data.current.temp,
        //     Humidity: data.current.humidity,
        //     Wind: data.current.wind_speed,
        //     Uvi: data.current.uvi,
        //     Icon: "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png"
        // }

        // //create h2 to hold titleCity
        // var titleCityEl = document.createElement("h2")
        // titleCityEl.className = "titleCity";
        // titleCityEl.innerHTML = cityName + " (" + today.Date + ")";

        // var imageIconEl = document.createElement("img")
        // imageIconEl.className = "imgIcon";
        // imageIconEl.setAttribute("src", today.Icon);

        
        // titleCityEl.appendChild(imageIconEl)
        // contentBoxEl.appendChild(titleCityEl)


        // //create temp h3
        // var cityTempEl = document.createElement("h3");
        // cityTempEl.textContent = "Temperature: " + today.Temp;
        
        // var tempSymbolEl = document.createElement("span");
        // tempSymbolEl.setAttribute("id", "temp")
        // tempSymbolEl.innerHTML = " &#8457;";

        // cityTempEl.appendChild(tempSymbolEl)
        // contentBoxEl.appendChild(cityTempEl)

        // //create humidity h3
        // var cityHumidityEl = document.createElement("h3");
        // cityHumidityEl.textContent = "Humidity: " + today.Humidity;
        
        // var humiditySymbolEl = document.createElement("span");
        // humiditySymbolEl.setAttribute("id", "humidity")
        // humiditySymbolEl.innerHTML = " &#x25;";

        // cityHumidityEl.appendChild(humiditySymbolEl)
        // contentBoxEl.appendChild(cityHumidityEl)
            

        // //create wind speed h3
        // var cityWindEl = document.createElement("h3");
        // cityWindEl.textContent = "Wind: ";
        
        // var windSymbolEl = document.createElement("span");
        // windSymbolEl.setAttribute("id", "wind")
        // windSymbolEl.innerHTML = today.Wind + " MPH";

        // cityWindEl.appendChild(windSymbolEl)
        // contentBoxEl.appendChild(cityWindEl)
            

        // //create uv index
        // var cityUvEl = document.createElement("h3");
        // cityUvEl.textContent = "UV Index: ";
        
        // var uvSymbolEl = document.createElement("span");

        // //index color identifier
        // if (today.Uvi >= 0 && today.Uvi < 3){
        //     uvSymbolEl.classList = "uv uv_index_low";
        // } else if (today.Uvi >= 3 && today.Uvi < 6){
        //     uvSymbolEl.classList = "uv uv_index_moderate";
        // } else if (today.Uvi >= 6 && today.Uvi < 8){
        //     uvSymbolEl.classList = "uv uv_index_high";
        // } else if (today.Uvi >= 8 && today.Uvi < 11){
        //     uvSymbolEl.classList = "uv uv_index_very_high";
        // } else {
        //     uvSymbolEl.classList = "uv uv_index_extreme";
        // }
        
        // uvSymbolEl.textContent = today.Uvi;

        // cityUvEl.appendChild(uvSymbolEl)
        // contentBoxEl.appendChild(cityUvEl)
            
       
        // forecast looper
        for (i =1; i<=5; i++){

            var forecast = {
                Date: timeConverter(data.daily[i].dt),
                Temp: data.daily[i].temp.day,
                Humidity: data.daily[i].humidity, 
                Icon: "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png"
            }

            
            //create forecast cards
            var forecastCard = document.createElement("div")
            forecastCard.className = "forecast_card"

                //create content of forecast card
                //create date holder
                var forecastDate = document.createElement("p")
                forecastDate.textContent = forecast.Date

                //icon holder
                var forecastImg = document.createElement("img")
                forecastImg.className = "imgIcon"
                forecastImg.setAttribute("src", forecast.Icon)

                //temp holder
                var forecastMinMax = document.createElement("p")
                forecastMinMax.innerHTML = "Temp: " + forecast.Temp + " &#8457;"
                
                //humidity holder
                var forecastHumidity = document.createElement("p")
                forecastHumidity.innerHTML = "Humidity: " + forecast.Humidity + "&#x25;"

                //build card
                forecastCard.appendChild(forecastDate)
                forecastCard.appendChild(forecastImg)
                forecastCard.appendChild(forecastMinMax)
                forecastCard.appendChild(forecastHumidity)

                //attach cards to container
                forecastBoxEl.appendChild(forecastCard)
        }
    });
}

//user input handler
function formSubmitHandler (event) {
    event.preventDefault();

    var cityContent = cityInputEl.value.trim();

    if (cityContent){
        getCityInfo(cityContent);

        //clear old content
        contentBoxEl.textContent="";
        forecastBoxEl.textContent= "";
        cityInputEl.value= "";
    } else {
        alert("Please Enter City Name")
    }
}

//storage handler
function localStorageHolder (cityName) {
    var nameCount = 0;
    
    //checks the previous 10 names
    if (cityNameArray.length <= 10) {
        for (i=cityNameArray.length-1; i>=0 ; i--){
            if (cityName === cityNameArray[i]){
                nameCount++;
            }
        }
    } else {
        //checks previous 10 names if array is over 10
        for (i=cityNameArray.length-1; i>cityNameArray.length-10 ; i--){
            if (cityName === cityNameArray[i]){
                nameCount++;
            }
        }
    }     

    //ensures cityNameArray doesn't hold duplicate names with range of 10 inputs
    if (nameCount === 0){
        cityNameArray.push(cityName);
        localStorage.setItem("cityNameArray", JSON.stringify(cityNameArray))
        searchHistoryBtns();
    }
}

//search history button 
function clickButtonHandler (event){
    var city = event.target.getAttribute("data-name");

  if (city) {
    getCityInfo(city);

    //clear old content
    contentBoxEl.textContent="";
    forecastBoxEl.textContent= "";
    cityInputEl.value= "";
  }
}

//build search buttons
function searchHistoryBtns (){
        
        searchHistoryEl.textContent=""

        //builds max of 10 history buttons
        if (cityNameArray.length <= 10) {
            for (i=cityNameArray.length-1; i>=0 ; i--){
                var searchHistoryBtnEl = document.createElement("button")
                searchHistoryBtnEl.className = "names"
                searchHistoryBtnEl.setAttribute("data-name", cityNameArray[i])
                searchHistoryBtnEl.textContent = cityNameArray[i]

                searchHistoryEl.appendChild(searchHistoryBtnEl)
            }
        } else {
            //builds of of the last 10 user inputs
            for (i=cityNameArray.length-1; i>cityNameArray.length-10 ; i--){
                var searchHistoryBtnEl = document.createElement("button")
                searchHistoryBtnEl.className = "names"
                searchHistoryBtnEl.setAttribute("data-name", cityNameArray[i])
                searchHistoryBtnEl.textContent = cityNameArray[i]

                searchHistoryEl.appendChild(searchHistoryBtnEl)
            }
        }        
}

//event listeners
searchHistoryEl.addEventListener("click", clickButtonHandler)
userFormEl.addEventListener("submit", formSubmitHandler);
