var resultTextEl = $("#result-container");
var cityname = $("#city-name");
var citytemp = $("#temp");
var citywind = $("#wind");
var cityhumi = $("#humi");
var currentDate = dayjs().format("[(]M[/]D[/]YYYY[)]");
var iconEl = $("#icon");
var historyEl = $("#history");

function getParams() {
  var searchParamsArr = document.location.search.split("&");
  var query = searchParamsArr[0].split("=").pop();
  var apiid = searchParamsArr[1].split("=").pop();

  searchApi(query, apiid);
}

function searchApi(city, apiid) {
  var owUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiid +
    "&units=imperial";

  fetch(owUrl)
    .then(function (response) {
      if (!response.ok) {
        resultTextEl.text("Please enter a valid city");
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {
      if (data) {
        console.log(data);
        var cityTemp = data.main.temp;
        var cityName = data.name;
        var cityWind = data.wind.speed;
        var cityHumi = data.main.humidity;
        var weatherDsc = data.weather[0].description;
        console.log(weatherDsc);
        iconGenerate(weatherDsc);
        
        var newWeather = {
            name: cityName,
            temp: cityTemp,
            wind: cityWind,
            humi: cityHumi,
            desc: weatherDsc,
        }
        cityname.text(cityName + " " + currentDate);
        citytemp.text("Temperature: " + cityTemp + " °F");
        citywind.text("Wind: " + cityWind + " mph");
        cityhumi.text("Humidity: " + cityHumi + " %");

        
        var weatherinfo = JSON.parse(localStorage.getItem('weatherInfos')) || [];
        var isNewWeather = true;

        for (var i = 0; i < weatherinfo.length; i++)    {
            var weatherName = weatherinfo[i].name;
            console.log(weatherName);
            if(newWeather.name === weatherName) {
                isNewWeather = false;
                break;
            }
        }
        displayHistory();

        if (isNewWeather)   {
            weatherinfo.push(newWeather);        
            savetoLocalStorage(weatherinfo);
            displayHistory();
        }

        console.log(newWeather.name);

        console.log(weatherName);
        console.log((newWeather.name === weatherName))
        console.log(isNewWeather);
        
        /*
        weatherinfo.push(newWeather);        
        savetoLocalStorage(weatherinfo);
        displayHistory();
        */
    }
    });
}
function iconGenerate(description) {
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



function savetoLocalStorage(weatherObject)   {
    localStorage.setItem('weatherInfos', JSON.stringify(weatherObject));
}
function displayHistory()   {
    var weatherinfo = JSON.parse(localStorage.getItem('weatherInfos')) || [];
    console.log(weatherinfo);
    historyEl.empty();
    for (var i = 0; i < weatherinfo.length; i++)    {
        var weatherhistory = weatherinfo[i];
        var wHistorycity = $("<button>").text(weatherhistory.name).addClass("btn btn-secondary").attr("id", "history-btn");
        historyEl.append(wHistorycity);
    }
    
}

getParams();
