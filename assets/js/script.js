// initialize search history
var searchHistory;
// checks if previous search history exists and retrieves it if applicable
if (localStorage.getItem("searchHistory") === null) {
    searchHistory = [];
}
else {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
}
// establish variable for api key
var apiKey = "5f9f4afbfb142ac29ca47b2737de474a";

// calls current end point to retrieve lat and lon for city
function callCurrent(cityName) {
    var currentDayQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
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
        var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        var iconAlt = response.daily[i].weather[0].description;
        var bdd = dd + i;
        bdd = bdd.toString();
        var containerEl = $("<div>");
        containerEl.addClass("five-day");
        var dateEl = $("<div>");
        dateEl.text(mm + "." + bdd + "." +yy);
        var imgEl = $("<img>");
        imgEl.attr("src", iconURL);
        imgEl.attr("alt", iconAlt);
        imgEl.attr("style", "background-color: lightsteelblue");
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
        containerEl.append(tempTitleEl);
        containerEl.append(tempEl);
        containerEl.append(humTitleEl);
        containerEl.append(humEl);
        $("#five-day").append(containerEl);
    }
}
// renders current weather section
function renderCurrentWeather(cityName, response) {
    var icon = response.current.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
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
    dateEl.text(mm + "." + dd + "." + yy);
    rowEl01.append(cityNameEl);
    rowEl01.append(iconEl);
    rowEl01.append(dateEl);
    // 2nd row - temperature and humidity
    var rowEl02 = $("<div>");
    rowEl02.addClass("row mx-auto");
    var tempEl01 = $("<div>");
    tempEl01.addClass("current-info-title");
    tempEl01.text("Temperature: ");
    var tempEl02 = $("<div>");
    tempEl02.addClass("current-info");
    tempEl02.text(response.current.temp + "°F");
    var humEl01 = $("<div>");
    humEl01.addClass("current-info-title");
    humEl01.text("Humidity: ");
    var humEl02 = $("<div>");
    humEl02.addClass("current-info");
    humEl02.text(response.current.humidity + "%");
    rowEl02.append(tempEl01);
    rowEl02.append(tempEl02);
    rowEl02.append(humEl01);
    rowEl02.append(humEl02);
    // 3rd row - windspeed and uv index
    var rowEl03 = $("<div>");
    rowEl03.addClass("row mx-auto");
    var windEl01 = $("<div>");
    windEl01.addClass("current-info-title");
    windEl01.text("Windspeed: ");
    var windEl02 = $("<div>");
    windEl02.addClass("current-info");
    windEl02.text(response.current.wind_speed + "mph");
    var uvEl01 = $("<div>");
    uvEl01.addClass("current-info-title");
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
        uvEl02.addClass("current-info low");
    }
    else if (uv >= 3 && uv < 6) {
        uvEl02.addClass("current-info moderate");
    }
    else if (uv >= 6 && uv < 8) {
        uvEl02.addClass("current-info high");
    }
    else if (uv >= 8 && uv < 11) {
        uvEl02.addClass("current-info very-high");
    }
    else {
        uvEl02.addClass("current-info extreme");
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
    searchHistory.unshift(cityName);
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
// starting script to render search history
renderSearchHistory();