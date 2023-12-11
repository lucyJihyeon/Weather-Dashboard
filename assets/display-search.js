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
        $("#enter-again").remove();
        var please = $("<p>")
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

    .then(function (data) {
      if (data) {
        $("#enter-again").remove();
        var cityTemp = data.main.temp;
        var cityName = data.name;
        var cityWind = data.wind.speed;
        var cityHumi = data.main.humidity;
        var weatherDsc = data.weather[0].description;
        var coorLat = data.coord.lat;
        var coorLon = data.coord.lon;
        
        iconGenerate(weatherDsc);

        var newWeather = {
          name: cityName,
          temp: cityTemp,
          wind: cityWind,
          humi: cityHumi,
          desc: weatherDsc,
          lat: coorLat,
          lon: coorLon,
        };
        cityname.text(cityName + " " + currentDate);
        citytemp.text("Temperature: " + cityTemp + " °F");
        citywind.text("Wind: " + cityWind + " mph");
        cityhumi.text("Humidity: " + cityHumi + " %");

        var weatherinfo =
          JSON.parse(localStorage.getItem("weatherInfos")) || [];
        var isNewWeather = true;

        for (var i = 0; i < weatherinfo.length; i++) {
          var weatherName = weatherinfo[i].name;
          if (newWeather.name === weatherName) {
            isNewWeather = false;
            break;
          }
        }
        displayHistory();

        if (isNewWeather) {
          weatherinfo.push(newWeather);
          savetoLocalStorage(weatherinfo);
          displayHistory();
        }
      }
      fiveDays(coorLat, coorLon);
    });
}
function fiveDays(lat, lon) {
  var owUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiid +
    "&units=imperial";

  fetch(owUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (data) {
      if (data) {
        var descriptions = [];
        $(".third-container").empty();
        for (var i = 1; i < 34; i += 8) {
          var fivedayContainer = $("<ul>");
          var dtUnix = data.list[i].dt;
          var dtTxt = dayjs(dtUnix * 1000).format("M[/]D[/]YYYY");
          var temp = data.list[i].main.temp + " °F";
          var humi = data.list[i].main.humidity + " %";
          var wind = data.list[i].wind.speed + " mph";
          var weatherDsc = data.list[i].weather[0].description
          descriptions.push(weatherDsc);
          console.log(weatherDsc);
          var icon = $("<i>").addClass("five-icon").attr("data-index", i);
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
          iconGenerate2(descriptions);
        }
      }
    });
}

function iconGenerate(description) {
  iconEl.removeAttr("class");
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

function iconGenerate2(descriptionArr) {
  var icon = $(".five-icon");
  for (var i = 0; i < icon.length; i++) {
    var fiveIcon = $(icon[i]);
    var description = descriptionArr[i];
    fiveIcon.removeAttr("class");

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

function savetoLocalStorage(weatherObject) {
  localStorage.setItem("weatherInfos", JSON.stringify(weatherObject));
}
function displayHistory() {
  var weatherinfo = JSON.parse(localStorage.getItem("weatherInfos")) || [];
  historyEl.empty();
  for (var i = 0; i < weatherinfo.length; i++) {
    var weatherhistory = weatherinfo[i];
    var wHistorycity = $("<button>")
      .text(weatherhistory.name)
      .addClass("btn btn-secondary")
      .attr({
        id: "history-btn",
        "data-index": i,
      });
    historyEl.append(wHistorycity);
  }
}

function getParamsHistory(weather) {
  var city = weather.name;
  searchApi(city, apiid);
}

function historyHandler(event) {
  event.preventDefault();
  $("#fiveday-container").empty();
  var dataIndex = $(this).data("index");
  var weatherinfo = JSON.parse(localStorage.getItem("weatherInfos")) || [];
  var targetWeather = weatherinfo[dataIndex];
  getParamsHistory(targetWeather);
  fiveDays(targetWeather.lat, targetWeather.lon);
}

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

historyEl.on("click", "#history-btn", historyHandler);
searchFormEl.on("click", "#searchbtn", submitHandler);

getParams();
