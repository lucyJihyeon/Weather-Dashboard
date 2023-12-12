var apikeyOW = "bd198fc2c921dcda5323e5669a78656f";
var searchFormEl = $("#search-form");


function submitHandler(event)   {
    //prevent default behavior 
    event.preventDefault();
    // retrieve the value entered in the search input field
    var searchInput = $("#search").val();
    //if searchinput is empty, prompt the user to enter it again.
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
    // build the query string for the search and redirect to the search results page
    var queryString = "./search-results.html?q=" + searchInput + "&appid=" + apikeyOW;
    location.assign(queryString);

}
//When the searchbtn element is clicked, call submitHandler function
searchFormEl.on("click", "#searchbtn", submitHandler);



