var resultTextEl = $("#result-container");
var cityname = $("#city-name");
var citytemp = $("#temp");
var citywind = $("#wind");
var cityhumi = $("#humi");



function getParams()    {
    var searchParamsArr = document.location.search.split('&');

    var query = searchParamsArr[0].split('=').pop();
    var apiid = searchParamsArr[1].split('=').pop();
    console.log(searchParamsArr);
    console.log(query)
    console.log(apiid)
    searchApi(query, apiid)
}

function searchApi(city, apiid) {
    var owUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiid + "&units=imperial";
    console.log(owUrl);
    fetch(owUrl)    
        .then(function (response)   {
            console.log(response);
            if(!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data)   {
            if(data)    {
                console.log(data);
                var temp = data.main.temp;
                var cityName = data.name;
                var cityWind = data.wind.speed;
                var cityHumi = data.main.humidity;
                cityname.text(cityName);
                citytemp.text("Temperature: " + temp + " °F");
                citywind.text("Wind: " + cityWind + " mph");
                cityhumi.text("Humidity: " + cityHumi + " %");


            }
        })
        
}
getParams();