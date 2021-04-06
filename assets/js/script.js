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
async function cityUvInfo (lat, lon, requestName) {
    //format request to url
    // debugger;


    var oneUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +  "&appid=27a6e74d4260774945191a8dc4b750e0&units=imperial"
    var stormApi = "https://api.stormglass.io/v2/tide/extremes/point?lat=" + lat + "&lng=" + lon;

    var stormApiArr = await fetch(stormApi, {
        headers: {
            'Authorization': 'a6c43a5a-9523-11eb-a242-0242ac130002-a6c43adc-9523-11eb-a242-0242ac130002'
        }
        })
        .then(function(jsonData){
            return jsonData.json();
        })
        .then(function(jsonData){
           
            console.log(jsonData)
            return jsonData;
        });

        console.log(stormApiArr)

    //make request to api
    fetch(oneUrl).then(function(response){
        return response.json()
    })
    .then(function(data){
       
        // forecast looper
        for (i =0; i<=4; i++){

            var forecast = {
                Date: timeConverter(data.daily[i].dt),
                Temp: data.daily[i].temp.day,
                Humidity: data.daily[i].humidity, 
                Icon: "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png"
            
            }
            
            

            var a = i*4;
            var b = a+1;
            var c = a+2;
            var d = a+3;
             

            function tideBuilder(j){
                var experiment = stormApiArr.data[j].time
                var expPart2 = experiment.split("T")
                var expPart3 = expPart2[1].split("+")
                var expPart4 = expPart3[0].split(":");
                var expPart5 = expPart4[0] + ":" + expPart4[1];
                return expPart5
            }
            var tide ={
                periodOneTime: tideBuilder(a),
                periodOneHeight: stormApiArr.data[a].height.toFixed(2),
                periodOneType: stormApiArr.data[a].type,

                periodTwoTime: tideBuilder(b),
                periodTwoHeight: stormApiArr.data[b].height.toFixed(2),
                periodTwoType: stormApiArr.data[b].type,

                periodThreeTime: tideBuilder(c),
                periodThreeHeight: stormApiArr.data[c].height.toFixed(2),
                periodThreeType: stormApiArr.data[c].type,

                periodFourTime: tideBuilder(d),
                periodFourHeight: stormApiArr.data[d].height.toFixed(2),
                periodFourType: stormApiArr.data[d].type

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

                //tide holder
                var periodOneTide = document.createElement("p")
                periodOneTide.innerHTML = "Time:" + tide.periodOneTime + " Wave Height:" + tide.periodOneHeight 

                var periodTwoTide = document.createElement("p")
                periodTwoTide.innerHTML = "Time:" + tide.periodTwoTime + " Wave Height:" + tide.periodTwoHeight

                var periodThreeTide = document.createElement("p")
                periodThreeTide.innerHTML = "Time:" + tide.periodThreeTime + " Wave Height:" + tide.periodThreeHeight

                var periodFourTide = document.createElement("p")
                periodFourTide.innerHTML = "Time:" + tide.periodFourTime + " Wave Height:" + tide.periodFourHeight

                //build card
                forecastCard.appendChild(forecastDate)
                forecastCard.appendChild(forecastImg)
                forecastCard.appendChild(forecastMinMax)
                forecastCard.appendChild(forecastHumidity)
                forecastCard.appendChild(periodOneTide)
                forecastCard.appendChild(periodTwoTide)
                forecastCard.appendChild(periodThreeTide)
                forecastCard.appendChild(periodFourTide)

                //attach cards to container
                forecastBoxEl.appendChild(forecastCard)
        }
        console.log(tide)
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
    // cityInputEl.value= "";
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
