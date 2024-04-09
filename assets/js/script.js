const APIKey = "b37c3f0b64ba65cf7ecc8f3b9292dc87";
let cityInput = document.getElementById('city-input');
let queryURL;
const searchedEl = document.getElementById('searched-cities');
let searchedCities = JSON.parse(localStorage.getItem('locations')) || []; // Retrieve searched city names from localStorage
 
function displaySearchedCities() {
    searchedEl.innerHTML = ""; // Clear existing city names
    searchedCities.forEach(city => {
        const cityElement = document.createElement('div');
        cityElement.textContent = city;
        cityElement.classList.add('searched-city');
        searchedEl.appendChild(cityElement);
        cityElement.addEventListener('click', function() {
            fetchWeatherData(city);
        });
    });
}
function init() {
    displaySearchedCities();
    const searchedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    for (const location of searchedLocations) {
        console.log(location);
        // Create clickable elements for each city in the search history
        const cityElement = document.createElement('div');
        cityElement.textContent = location;
        cityElement.classList.add('searched-city');
        searchedEl.appendChild(cityElement);
        // Add event listeners to the city elements
        cityElement.addEventListener('click', function() {
            fetchWeatherData(location);
        });
        searchedCities.push(location);
    }
    document.getElementById('search-button').addEventListener('click', function() {
        const city = cityInput.value;
        const cityDisplay = document.createElement('div');
        cityDisplay.textContent = ` ${city}`;
        cityDisplay.classList.add('city-name'); // Add a class to the city name element
        searchedEl.appendChild(cityDisplay);
        cityInput.value = "";
 
        // Scroll to the city name element
        // Add the city to the searchedCities array
        searchedCities.push(city);
        // Save the searchedCities array to localStorage
        localStorage.setItem('locations', JSON.stringify(searchedCities));

        fetchWeatherData(city);
    });
}
function fetchWeatherData(city) {
    queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;
 
    fetch(queryURL)
        .then(response => response.json())
        .then(data => {
            const forecastList = data.list;
            const forecastContainer = document.createElement('div');
            forecastContainer.classList.add('forecast-container');
 
            // Display the city name
            const cityName = document.createElement('h2');
            cityName.textContent = city;
            searchedEl.appendChild(cityName);
 
            for (let i = 0; i < forecastList.length; i += 8) {
                const forecastData = forecastList[i];
                const date = new Date(forecastData.dt * 1000).toLocaleDateString();
                const icon = forecastData.weather[0].icon;
                const temperature = forecastData.main.temp;
                const humidity = forecastData.main.humidity;
                const windSpeed = forecastData.wind.speed;
 
                const forecastItemContainer = document.createElement('div');
                forecastItemContainer.classList.add('forecast-item-container');
 
                const forecastElement = document.createElement('div');
                forecastElement.classList.add('forecast-item');
                forecastElement.innerHTML = `
                    <p>Date: ${date}</p>
                    <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
                    <p>Temperature: ${temperature} K</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                `;
 
                forecastItemContainer.appendChild(forecastElement);
                forecastContainer.appendChild(forecastItemContainer);
            }
 
            searchedEl.appendChild(forecastContainer);
 
            // Add the searched city to the search history
            searchedLocations.push(city);
            localStorage.setItem('searchedLocations', JSON.stringify(searchedLocations));
        });
}
 
init();