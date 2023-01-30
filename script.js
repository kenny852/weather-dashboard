function initPage() {
    var cityEl = document.getElementById("enter-city");
    var searchEl = document.getElementById("search-button");
    var clearEl = document.getElementById("clear-history");
    var nameEl = document.getElementById("city-name");
    var currentPicEl = document.getElementById("current-pic");
    var currentTempEl = document.getElementById("temperature");
    var currentHumidityEl = document.getElementById("humidity");
    var currentWindEl = document.getElementById("wind-speed");
    var historyEl = document.getElementById("history");
    var fivedayEl = document.getElementById("fiveday-header");
    var todayweatherEl = document.getElementById("today-weather");
    var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    // API key
    var APIKey = "d0b692c714294deb853cad9af74638b2";

    function getWeather(cityName) {
        // get request from open weather api
        var weatherapi = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(weatherapi)
            .then(function (response) {

                todayweatherEl.classList.remove("fiveday");

                // display current weather
                var currentDate = new Date(response.data.dt * 1000);
                var day = currentDate.getDate();
                var month = currentDate.getMonth() + 1;
                var year = currentDate.getFullYear();
                var weatherPic = response.data.weather[0].icon;
                nameEl.innerHTML = response.data.name + " (" + day + "/" + month + "/" + year + ") ";
                currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + ".png");
                currentTempEl.innerHTML = "Temperature: " + k2c(response.data.main.temp) + " &#176C" + " ( " + k2f(response.data.main.temp) + " &#176F )";
                currentWindEl.innerHTML = "Wind Speed: " + m2k(response.data.wind.speed) + " KPH" + " ( " + response.data.wind.speed + " MPH )";
                currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                
                // Get 5 day forecast for this city
                var cityID = response.data.id;
                var forecastofcity = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                axios.get(forecastofcity)
                    .then(function (response) {
                        fivedayEl.classList.remove("fiveday");
                        
                        // display forecast for next 5 days
                        var forecastEls = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecastEls.length; i++) {
                            forecastEls[i].innerHTML = "";
                            var forecastIndex = i * 8 + 4;
                            var forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            var forecastDay = forecastDate.getDate();
                            var forecastMonth = forecastDate.getMonth() + 1;
                            var forecastYear = forecastDate.getFullYear();
                            var forecastDateEl = document.createElement("p");
                            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDateEl.innerHTML = forecastDay + "/" + forecastMonth + "/" + forecastYear;
                            forecastEls[i].append(forecastDateEl);

                            var forecastWeatherEl = document.createElement("img");
                            forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + ".png");
                            forecastEls[i].append(forecastWeatherEl);
                            
                            const forecastTempEl = document.createElement("p");
                            forecastTempEl.innerHTML = "Temp: " + k2c(response.data.list[forecastIndex].main.temp) + " &#176C" + " ( " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F )";
                            forecastEls[i].append(forecastTempEl);
                            
                            const forecastWindEl = document.createElement("p");
                            forecastWindEl.innerHTML = "Wind Speed: " + m2k(response.data.list[forecastIndex].wind.speed) + " KPH";
                            forecastEls[i].append(forecastWindEl);
                            
                            const forecastHumidityEl = document.createElement("p");
                            forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecastEls[i].append(forecastHumidityEl);
                        }
                    })
            });
    }

    // Get history from local storage
    searchEl.addEventListener("click", function () {
        const searchTerm = cityEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    // Clear History
    clearEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })

    function k2c(K) {
        return Math.floor(K - 273.15);
    }
    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }
    function m2k(Kph) {
        return Math.floor(Kph * 1.609344);
    }

    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (var i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control list d-block");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                getWeather(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
    
}
initPage();