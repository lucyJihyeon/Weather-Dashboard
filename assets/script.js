var apikeyOW = "bd198fc2c921dcda5323e5669a78656f";
var searchFormEl = $("#search-form");

function submitHandler(event)   {
    event.preventDefault();

    var searchInput = $("#search").val();
    if (!searchInput)   {
        var enterAgain = $("#enter-again")
        for (var i = 0; i < enterAgain.length; i ++)    {
            enterAgain[i].empty();
        }
        var please = $("<p>").text("Please enter a city!").css({
            "color": "white",
            "text-align":"center",
        }).attr("id", "enter-again");
        searchFormEl.append(please);
        return;
    }
    var queryString = "./search-results.html?q=" + searchInput + "&appid=" + apikeyOW;
    location.assign(queryString);

}

searchFormEl.on("click", submitHandler);




