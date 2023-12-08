var resultTextEl = $("#result-container");
var cityname = $("#city-name");
var citytemp = $("#temp");
var citywind = $("#wind");
var cityhumi = $("#humi");
var currentDate = dayjs().format("[(]M[/]D[/]YYYY[)]");
var iconEl = $("#icon");

function getParams() {
  var searchParamsArr = document.location.search.split("&");
  var query = searchParamsArr[0].split("=").pop();
  var apiid = searchParamsArr[1].split("=").pop();
  console.log(searchParamsArr);
  console.log(query);
  console.log(apiid);
  searchApi(query, apiid);
}

function searchApi(city, apiid) {
  var owUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiid +
    "&units=imperial";
  console.log(owUrl);
  fetch(owUrl)
    .then(function (response) {
      console.log(response);
      if (!response.ok) {
        resultTextEl.text("Please enter a valid city");
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {
      if (data) {
        console.log(data);
        var temp = data.main.temp;
        var cityName = data.name;
        var cityWind = data.wind.speed;
        var cityHumi = data.main.humidity;
        var weatherDsc = data.weather[0].description;
        console.log(weatherDsc);
        iconGenerate(weatherDsc);
        cityname.text(cityName + " " + currentDate);
        citytemp.text("Temperature: " + temp + " °F");
        citywind.text("Wind: " + cityWind + " mph");
        cityhumi.text("Humidity: " + cityHumi + " %");
      }

      function iconGenerate(description) {
        if (description.includes("rain")) {
          iconEl.addClass("fas fa-solid fa-cloud-rain mx-2").css({
            color: "var(--cloud-color)",
          });
        } else if (description.includes("mist") || description.includes("smoke") ||
        description.includes("haze") || description.includes("dust") || 
        description.includes("sand") || description.includes("fog") || 
        description.includes("ash") || description.includes("squalls") || 
        description.includes("tornado")) {
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
    });
}
getParams();
