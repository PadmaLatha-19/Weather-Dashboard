const cityInput = document.getElementById("city");
const searchButton = document.getElementById("search");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const date = document.getElementById("date");
const emoji = document.getElementById("emojii");

const recentSearches = document.getElementById("recent-searches");

searchButton.addEventListener("click", function () {
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city");
        return;
    }

    getWeather(city);
    cityInput.value = "";
});

cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
});

async function getWeather(city) {
    try {
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            alert("City not found");
            return;
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        const currentWeather = weatherData.current;

        cityName.textContent = location.name;

        temperature.textContent =
            currentWeather.temperature_2m + " °C";

        humidity.textContent =
            currentWeather.relative_humidity_2m + "%";

        windSpeed.textContent =
            currentWeather.wind_speed_10m + " km/h";

        date.textContent =
            new Date().toLocaleDateString();

        emoji.textContent =
            getWeatherEmoji(currentWeather.weather_code);

        saveRecentSearch(location.name);
        displayRecentSearches();

    } catch (error) {
        alert("Something went wrong. Please try again.");
        console.log(error);
    }
}

function getWeatherEmoji(code) {
    if (code === 0) {
        return "☀️";
    } else if (code >= 1 && code <= 3) {
        return "⛅";
    } else if (code >= 45 && code <= 48) {
        return "🌫️";
    } else if (code >= 51 && code <= 67) {
        return "🌧️";
    } else if (code >= 71 && code <= 77) {
        return "❄️";
    } else if (code >= 80 && code <= 82) {
        return "🌦️";
    } else if (code >= 95) {
        return "⛈️";
    }

    return "🌤️";
}

function saveRecentSearch(city) {
    let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];

    searches = searches.filter(function (item) {
        return item.toLowerCase() !== city.toLowerCase();
    });

    searches.unshift(city);

    searches = searches.slice(0, 5);

    localStorage.setItem("recentSearches", JSON.stringify(searches));
}

function displayRecentSearches() {
    const searches =
        JSON.parse(localStorage.getItem("recentSearches")) || [];

    recentSearches.innerHTML = "";

    searches.forEach(function (city) {
        const li = document.createElement("li");

        li.textContent = city;

        li.addEventListener("click", function () {
            cityInput.value = city;
            getWeather(city);
        });

        recentSearches.appendChild(li);
    });
}

displayRecentSearches();
