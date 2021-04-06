var contentBoxEl = document.querySelector("#content-box")
var forecastBoxEl = document.querySelector("#forecast_box")
var cityInputEl = document.querySelector("#cityInput")
var userFormEl = document.querySelector("#user-form")
var searchHistoryEl = document.querySelector("#search-history")
var cityNameHolder = []




// init cityNameArray
var cityNameArray = JSON.parse(localStorage.getItem("cityNameArray"));
   // //init homepage if none exist in local storage
   if(!cityNameArray){
       cityNameArray = ["Miami", "Tampa", "Jacksonville", "Melbourne"]
    //    getCityInfo("Miami"),
    //    getCityInfo("Tampa")
    //    getCityInfo("Jacksonville")
    //    getCityInfo("Melbourne");
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
    // debugger;


    var oneUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +  "&appid=27a6e74d4260774945191a8dc4b750e0&units=imperial"
    var stormApi = "https://api.stormglass.io/v2/tide/extremes/point?lat=" + lat + "&lng=" + lon;
    var cityName = requestName;

    fetch(stormApi, {
  headers: {
    'Authorization': 'a6c43a5a-9523-11eb-a242-0242ac130002-a6c43adc-9523-11eb-a242-0242ac130002'
  }
    }).then((response) => response.json()).then((jsonData) => {
    console.log(jsonData)
    console.log(jsonData.data[0].height.toFixed(2))

    var experiment = jsonData.data[1].time
    var expPart2 = experiment.split("T")
    var expPart3 = expPart2[1].split("+")
    console.log(expPart3[0])
    });

    //make request to api
    fetch(oneUrl).then(function(response){
        return response.json()
    })
    .then(function(data){

      
            
       
        // forecast looper
        for (i =0; i<=4; i++){

            var j = i*4
            

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
