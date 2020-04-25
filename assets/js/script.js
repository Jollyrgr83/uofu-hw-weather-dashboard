// OVERVIEW
// This project uses the Current Weather and One Call endpoints from the OpenWeatherMap API to display weather data for a city name that is provided by the user.
// This script is divided into the following categories: Variables, Functions, Event Listeners, and Starting Script. 
// VARIABLES - The variable apiKey is established first and is used in the endpoint call urls. 
// FUNCTIONS - 
// callCurrent - takes in the cityName variable from the user search functions to call the Current Weather end point in order to retrieve the latitude (lat) and longitude (lon) for the city. The cityName, lat, and lon are then sent to callOneCall.
// callOneCall - takes in the cityName, lat, and lon from callCurrent to call the One Call end point in order to retrieve the weather information. Uses renderCurrentWeather and renderFiveDayForecast to update the html with the weather data.
// renderCurrentWeather and renderFiveDayForecast are called in callOneCall to generate the html elements and populate them with the associated weather data. The UV index div is automatically updated with a color to indicate the warning level of the UV index value. See comments below for more information.
// renderSearchHistory clears, generates, and populates the html elements in the search history section.
// EVENT LISTENERS - there are 3 event listeners used: search button, search history buttons, and clear button. The search button event listener updates the search history and runs the end point call functions to update the search history and weather data based on the user input in the text input. The search history buttons update the search history and run the end point call functions to update the search history and weather data based on the button value. The clear button clears the search history.
// STARTING SCRIPT - initializes the search history from local storage, runs the end point calls to update weather data for the most recent search entry (if available), and renders the search history

// establish variable for api key
var apiKey = "5f9f4afbfb142ac29ca47b2737de474a";

// FUNCTIONS

// calls current end point to retrieve lat and lon for city
function callCurrent(cityName) {
    var currentDayQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    $.ajax({
        url: currentDayQueryURL,
        method: "GET"
    }).then(function(response) {
        callOneCall(cityName, response.coord.lat, response.coord.lon);
    });
}
// calls one call end point to retrieve all weather data
function callOneCall(cityName, lat, lon) {
    var oneCallQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + apiKey;
    $.ajax({
        url: oneCallQueryURL,
        method: "GET"
    }).then(function(response) {
        console.log("response", response);
        renderCurrentWeather(cityName, response);
        renderFiveDayForecast(response);
    })
}
// renders search history entries
function renderSearchHistory() {
    $("#search-history").empty();
    $.each(searchHistory, function(i, city) {
        var rowEl = $("<button>");
        rowEl.addClass("row mx-auto btn btn-light search-history");
        rowEl.text(city);
        rowEl.attr("id","history-button");
        $("#search-history").append(rowEl);
    });
}
// renders five day forecast
function renderFiveDayForecast(response) {
    // deletes previous entries if present
    $("#five-day").empty();
    var a = new Date();
    var mm = a.getMonth() + 1;
    mm = mm.toString();
    var dd = a.getDate();
    var yyyy = a.getFullYear();
    yyyy = yyyy.toString();
    var yy = yyyy.charAt(2) + yyyy.charAt(3);
    for (let i = 1; i < 6; i++) {
        var icon = response.daily[i].weather[0].icon;
        var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        var iconAlt = response.daily[i].weather[0].description;
        var bdd = dd + i;
        bdd = bdd.toString();
        var containerEl = $("<div>");
        containerEl.addClass("five-day-container col-sm-2");
        var dateEl = $("<div>");
        dateEl.text(mm + "/" + bdd + "/" +yy);
        dateEl.addClass("five-day");
        var imgEl = $("<img>");
        imgEl.attr("src", iconURL);
        imgEl.attr("alt", iconAlt);
        imgEl.attr("class", "five-day-icon");
        var infoContainerEl = $("<div>");
        infoContainerEl.addClass("five-day");
        var tempTitleEl = $("<div>");
        tempTitleEl.text("Temp:")
        var tempEl = $("<div>");
        tempEl.text(response.daily[i].temp.day + "°F");
        var humTitleEl = $("<div>");
        humTitleEl.text("Humidity:");
        var humEl = $("<div>");
        humEl.text(response.daily[i].humidity + "%");
        containerEl.append(dateEl);
        containerEl.append(imgEl);
        infoContainerEl.append(tempTitleEl);
        infoContainerEl.append(tempEl);
        infoContainerEl.append(humTitleEl);
        infoContainerEl.append(humEl);
        containerEl.append(infoContainerEl);
        $("#five-day").append(containerEl);
    }
}
// renders current weather section
function renderCurrentWeather(cityName, response) {
    var icon = response.current.weather[0].icon;
    var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    var iconAlt = response.current.weather[0].description;
    var a = new Date();
    var mm = a.getMonth() + 1;
    mm = mm.toString();
    var dd = a.getDate();
    dd = dd.toString();
    var yyyy = a.getFullYear();
    yyyy = yyyy.toString();
    var yy = yyyy.charAt(2) + yyyy.charAt(3);
    // clear existing current weather section
    $(".current-weather").empty();
    // 1st row - city name, weather icon, and date
    var rowEl01 = $("<div>");
    rowEl01.addClass("row");
    var cityNameEl = $("<h2>");
    cityNameEl.addClass("p-3 mt-2 mx-auto");
    cityNameEl.text(cityName);
    var iconEl = $("<img>");
    iconEl.addClass("mx-auto");
    iconEl.attr("src", iconURL);
    iconEl.attr("alt", iconAlt);
    var dateEl = $("<h2>");
    dateEl.addClass("p-3 mt-2 mx-auto");
    dateEl.text(mm + "/" + dd + "/" + yy);
    rowEl01.append(cityNameEl);
    rowEl01.append(iconEl);
    rowEl01.append(dateEl);
    // 2nd row - temperature and humidity
    var rowEl02 = $("<div>");
    rowEl02.addClass("row mx-auto");
    var tempEl01 = $("<div>");
    tempEl01.addClass("col-sm-2 current-info-title");
    tempEl01.text("Temperature: ");
    var tempEl02 = $("<div>");
    tempEl02.addClass("current-info col-sm-2");
    tempEl02.text(response.current.temp + "°F");
    var humEl01 = $("<div>");
    humEl01.addClass("current-info-title col-sm-2");
    humEl01.text("Humidity: ");
    var humEl02 = $("<div>");
    humEl02.addClass("current-info col-sm-2");
    humEl02.text(response.current.humidity + "%");
    rowEl02.append(tempEl01);
    rowEl02.append(tempEl02);
    rowEl02.append(humEl01);
    rowEl02.append(humEl02);
    // 3rd row - windspeed and uv index
    var rowEl03 = $("<div>");
    rowEl03.addClass("row mx-auto");
    var windEl01 = $("<div>");
    windEl01.addClass("current-info-title col-sm-2");
    windEl01.text("Windspeed: ");
    var windEl02 = $("<div>");
    windEl02.addClass("current-info col-sm-2");
    windEl02.text(response.current.wind_speed + "mph");
    var uvEl01 = $("<div>");
    uvEl01.addClass("current-info-title col-sm-2");
    uvEl01.text("UV Index: ");
    var uvEl02 = $("<div>");
    // updates background color of uv index 
    // 0 - 3: low - green
    // 3 - 5: moderate - yellow
    // 6 - 7: high - orange
    // 8 - 10: very high - red
    // 11+: extreme - violet
    var uv = response.current.uvi;
    if (uv < 3) {
        uvEl02.addClass("current-info low col-sm-2");
    }
    else if (uv >= 3 && uv < 6) {
        uvEl02.addClass("current-info moderate col-sm-2");
    }
    else if (uv >= 6 && uv < 8) {
        uvEl02.addClass("current-info high col-sm-2");
    }
    else if (uv >= 8 && uv < 11) {
        uvEl02.addClass("current-info very-high col-sm-2");
    }
    else {
        uvEl02.addClass("current-info extreme col-sm-2");
    }
    uvEl02.text(uv);
    rowEl03.append(windEl01);
    rowEl03.append(windEl02);
    rowEl03.append(uvEl01);
    rowEl03.append(uvEl02);
    // append 3 rows to current weather section
    $(".current-weather").append(rowEl01);
    $(".current-weather").append(rowEl02);
    $(".current-weather").append(rowEl03);
}

// EVENT LISTENERS

// assigns click event to search button to allow searching
$("#button").on("click", function() {
    var cityName = $("#cityInput").val().trim();
    searchHistory.unshift(cityName);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderSearchHistory();
    callCurrent(cityName);
});
// assigns click event to all search history buttons to allow searching
$(document).on("click", "#history-button", function() {
    var cityName = event.target.textContent;
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderSearchHistory();
    callCurrent(cityName);
})
// assigns click event to clear button to clear search history
$("#clear").on("click", function() {
    searchHistory = [];
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderSearchHistory();
})

// STARTING SCRIPT

// initialize search history
var searchHistory;
// checks if previous search history exists and retrieves it if applicable
if (localStorage.getItem("searchHistory") === null) {
    searchHistory = [];
}
// if search history exists, preloads weather information for most recent search entry
else {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    console.log("searchHistory", searchHistory[0]);
    callCurrent(searchHistory[0]);
}
// renders search history
renderSearchHistory();