var resultTextEl = $("#result-container");
var cityname = $("#city-name");
var citytemp = $("#temp");
var citywind = $("#wind");
var cityhumi = $("#humi");
var currentDate = dayjs().format("[(]M[/]D[/]YYYY[)]");
var iconEl = $("#icon");
var historyEl = $("#history");
var historyBtn = $("#history-btn");
var apiid = "bd198fc2c921dcda5323e5669a78656f";
var searchFormEl = $("#search-form");

//Function to get a parameters from the URL and initiate a search
function getParams() {
  var searchParamsArr = document.location.search.split("&");
  var query = searchParamsArr[0].split("=").pop();
  var apiid = searchParamsArr[1].split("=").pop();
  searchApi(query, apiid);
}

//Function to handler the main weather search
function searchApi(city, apiid) {
  var owUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiid +
    "&units=imperial";
  //Fetch the weather data
  fetch(owUrl)
    .then(function (response) {
      if (!response.ok) {
        //check for a valid response
        $("#enter-again").remove();
        var please = $("<p>")
          //if not valid, prompt the user to re-enter
          .text("Please enter a valid city name!")
          .css({
            color: "white",
            "text-align": "center",
          })
          .attr("id", "enter-again");
        searchFormEl.append(please);
        throw response.json();
      }
      return response.json();
    })
    //if valid response, get the data 
    .then(function (data) {
      if (data) {
        $("#enter-again").remove();
        //extract weather data from the data
        var cityTemp = data.main.temp;
        var cityName = data.name;
        var cityWind = data.wind.speed;
        var cityHumi = data.main.humidity;
        var weatherDsc = data.weather[0].description;
        var coorLat = data.coord.lat;
        var coorLon = data.coord.lon;
        //generate and display weather icon according to the weather description
        iconGenerate(weatherDsc);

        //create a weather object
        var newWeather = {
          name: cityName,
          temp: cityTemp,
          wind: cityWind,
          humi: cityHumi,
          desc: weatherDsc,
          lat: coorLat,
          lon: coorLon,
        };
        //display current weather information 
        cityname.text(cityName + " " + currentDate);
        citytemp.text("Temperature: " + cityTemp + " °F");
        citywind.text("Wind: " + cityWind + " mph");
        cityhumi.text("Humidity: " + cityHumi + " %");

        //Get weather history from the local storage
        var weatherinfo =
          JSON.parse(localStorage.getItem("weatherInfos")) || [];
        
        //Check if the current weather is alreay in the local storage
        var isNewWeather = true;
        for (var i = 0; i < weatherinfo.length; i++) {
          var weatherName = weatherinfo[i].name;
          if (newWeather.name === weatherName) {
            isNewWeather = false;
            break;
          }
        }
        //display and save weather history
        displayHistory();

        if (isNewWeather) {
          weatherinfo.push(newWeather);
          savetoLocalStorage(weatherinfo);
          displayHistory();
        }
      }
      //function to display five-day forecast
      fiveDays(coorLat, coorLon);
    });
}
//function to display five-day forecast 
function fiveDays(lat, lon) {
  //build the openweathermap api url for five-day forecast
  var owUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiid +
    "&units=imperial";

  //fetch the url 
  fetch(owUrl)
    //check if the response if valid
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    //if valid, retrieve the data
    .then(function (data) {
      if (data) {
        //create an empty description array to store five different weather descriptions
        var descriptions = [];
        //clear the previous forecast items 
        $(".third-container").empty();
        //starting from 1 (indicating current date's data at 15:00), loop through the forecast data 
        //and create forecast items
        //data updates every 3 hours, so add i by 8 to get the data from the next day at 15:00.
        for (var i = 1; i < 34; i += 8) {
          var fivedayContainer = $("<ul>");
          var dtUnix = data.list[i].dt;
          var dtTxt = dayjs(dtUnix * 1000).format("M[/]D[/]YYYY");
          var temp = data.list[i].main.temp + " °F";
          var humi = data.list[i].main.humidity + " %";
          var wind = data.list[i].wind.speed + " mph";
          var weatherDsc = data.list[i].weather[0].description
          //store the weather description to the description array 
          descriptions.push(weatherDsc);
          //adding a class "five-icon" for the icongenerate2 function 
          var icon = $("<i>").addClass("five-icon");
          //display the weather information for each day
          var forecastItem = $("<li>").text(dtTxt);
          var tempItem = $("<li>").text("Temp " + temp);
          var humiItem = $("<li>").text("Humidity: " + humi);
          var windItem = $("<li>").text("Wind: " + wind);

          fivedayContainer.append(
            forecastItem,
            icon,
            tempItem,
            windItem,
            humiItem
          );
          $(".third-container").append(fivedayContainer);
          //generate and display weather icons for the forecast items. 
          iconGenerate2(descriptions);
        }
      }
    });
}
//function to generate and set weather icon based on the current weather description
function iconGenerate(description) {
  //remove the previoius data
  iconEl.removeAttr("class");
  //creating a weather icon by adding a class from font awesome to the <i> element based on the weather description  
  if (description.includes("rain")) {
    iconEl.addClass("fas fa-solid fa-cloud-rain mx-2").css({
      color: "var(--cloud-color)",
    });
  } else if (
    description.includes("mist") ||
    description.includes("smoke") ||
    description.includes("haze") ||
    description.includes("dust") ||
    description.includes("sand") ||
    description.includes("fog") ||
    description.includes("ash") ||
    description.includes("squalls") ||
    description.includes("tornado")
  ) {
    iconEl.addClass("fas fa-solid fa-water mx-2").css({
      color: "grey",
    });
  } else if (description.includes("clear")) {
    iconEl.addClass("fas fa-solid fa-star mx-2").css({
      color: "yellow",
    });
  } else if (description.includes("snow") || description.includes("sleet")) {
    iconEl.addClass("fas fa-solid fa-snowflake mx-2").css({
      color: "var(--cloud-color)",
    });
  } else if (description.includes("thunderstorm")) {
    iconEl.addClass("fas fa-solid fa-cloud-bolt mx-2").css({
      color: "#53565a",
    });
  } else if (description.includes("drizzle")) {
    iconEl.addClass("fas fa-solid fa-cloud-rain mx-2").css({
      color: "var(--cloud-color)",
    });
  } else if (description.includes("clouds")) {
    iconEl.addClass("fas fa-solid fa-cloud mx-2").css({
      color: "grey",
    });
  }
}

//function to generate and set weather icon based on the description of the forecast items.
function iconGenerate2(descriptionArr) {
  var icon = $(".five-icon");
  //loop through the forecast items and retreive the weather description
  for (var i = 0; i < icon.length; i++) {
    var fiveIcon = $(icon[i]);
    var description = descriptionArr[i];
    //remove the previous classes
    fiveIcon.removeAttr("class");

    //creating a weather icon by adding a class from font awesome to the <i> element based on the weather description 
    if (description.includes("rain")) {
      fiveIcon.addClass("five-icon fas fa-solid fa-cloud-rain mx-2").css({
        color: "var(--cloud-color)",
      });
    } else if (description.includes("clouds")) {
      fiveIcon.addClass("five-icon fas fa-solid fa-cloud mx-2").css({
        color: "grey",
      });
    } else if (
      description.includes("mist") ||
      description.includes("smoke") ||
      description.includes("haze") ||
      description.includes("dust") ||
      description.includes("sand") ||
      description.includes("fog") ||
      description.includes("ash") ||
      description.includes("squalls") ||
      description.includes("tornado")
    ) {
      fiveIcon.addClass("five-icon fas fa-solid fa-water mx-2").css({
        color: "grey",
      });
    } else if (description.includes("clear")) {
      fiveIcon.addClass("five-icon fas fa-solid fa-star mx-2").css({
        color: "yellow",
      });
    } else if (description.includes("snow") || description.includes("sleet")) {
      fiveIcon.addClass("five-icon fas fa-solid fa-snowflake mx-2").css({
        color: "var(--cloud-color)",
      });
    } else if (description.includes("thunderstorm")) {
      fiveIcon.addClass("five-icon fas fa-solid fa-cloud-bolt mx-2").css({
        color: "#53565a",
      });
    } else if (description.includes("drizzle")) {
      fiveIcon.addClass("five-icon fas fa-solid fa-cloud-rain mx-2").css({
        color: "var(--cloud-color)",
      });
    }

  }

}

//function to save the weather object into the local storage
function savetoLocalStorage(weatherObject) {
  localStorage.setItem("weatherInfos", JSON.stringify(weatherObject));
}
//function to display history buttons
function displayHistory() {
  var weatherinfo = JSON.parse(localStorage.getItem("weatherInfos")) || [];
  //make sure the empty the history element to prevent duplicated items.
  historyEl.empty();
  //loop through the weatherinfo objects and display items 
  for (var i = 0; i < weatherinfo.length; i++) {
    var weatherhistory = weatherinfo[i];
    var wHistorycity = $("<button>")
      .text(weatherhistory.name)
      .addClass("btn btn-secondary")
      //add data-index to indicate the index number 
      //so that we can retrieve the cooresponsing data 
      .attr({
        id: "history-btn",
        "data-index": i,
      });
    historyEl.append(wHistorycity);
  }
}
//function to retreive the city name and search from the url 
function getParamsHistory(weather) {
  var city = weather.name;
  searchApi(city, apiid);
}
//function to retrieve the corresponding data from the history button
function historyHandler(event) {
  event.preventDefault();
  //make sure to empty out the fiveday-conrainer to prevent duplicated items.
  $("#fiveday-container").empty();
  //retrieve the index number of the history button element
  var dataIndex = $(this).data("index");
  //get weatherInfos item from the local storage.
  var weatherinfo = JSON.parse(localStorage.getItem("weatherInfos")) || [];
  //take the data stored at the certain index number and store it in a variable.
  var targetWeather = weatherinfo[dataIndex];
  getParamsHistory(targetWeather);
  //call fiveDays function to display the forecast items of the city 
  fiveDays(targetWeather.lat, targetWeather.lon);
}

//function to retrieve the value entered in the search input field
function submitHandler(event) {
  event.preventDefault();

  var searchInput = $("#search").val();
  if (!searchInput) {
    $("#enter-again").remove();
    var please = $("<p>")
      .text("Please enter a city!")
      .css({
        color: "white",
        "text-align": "center",
      })
      .attr("id", "enter-again");
    searchFormEl.append(please);
    return;
  }
  searchApi(searchInput, apiid);
}

//add eventlistener to the history button 
historyEl.on("click", "#history-btn", historyHandler);
//add event listener to the search button inside of the search from element
searchFormEl.on("click", "#searchbtn", submitHandler);

//call getParams function to start. 
getParams();
