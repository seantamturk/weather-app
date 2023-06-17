var APIKey = "960d808ec0452e361d474ea77ae8454c";

var searchPlace = document.getElementById("search-area");
var searchBtn = document.getElementById("search-btn");
var searchForm = document.getElementById("search-form");
var today = document.getElementById("today");
var fiveDayHeader = document.getElementById("five-day-header");
var forecast = document.getElementById("forecast");
var historyElement = document.getElementById("history");
var listOfCities = JSON.parse(localStorage.getItem("ListOfCities")) || [];
// Event listener for search form submission
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var city = searchPlace.value;
    coordinatesFromCity(city);
});

// Function to render buttons from localStorage
// function renderButtonsFromLocalStorage() {
//     // Clear existing buttons
//     historyElement.innerHTML = '';
  
//     // Retrieve data from localStorage
//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       const value = localStorage.getItem(key);
  
//       // Check if the value matches the weather planner
//       if (value === "weather-planner") {
//         const button = document.createElement('button');
//         button.classList.add('custom-btn', 'my-1');
//         button.textContent = key;
//         historyElement.appendChild(button);
//       }
//     }
//   }
  

  populateHistory();

function  populateWeather(){
          let cityToBeSearched = this.textContent;
          console.log(cityToBeSearched);
          coordinatesFromCity(cityToBeSearched);
}

function populateHistory(){ 
    let cityList =  JSON.parse(localStorage.getItem("ListOfCities"));
    if( cityList > 5){
          cityList.shift();
          
    }
    historyElement.innerHTML = '';
    for(let i=0; i< cityList.length ; i++ ){
        let btnEl = document.createElement("button");
        btnEl.textContent = cityList[i];
        historyElement.appendChild(btnEl);
        btnEl.addEventListener("click", populateWeather)
    } 
}

function addCityToLocalStorage(city){
    let cityName = city.toLowerCase();
    console.log("addcityname", cityName);
    // let listOfCities = JSON.parse(localStorage.getItem("ListOfCities")) || [];
    if(listOfCities.length === 0 || !listOfCities.includes(cityName)){
        if(listOfCities.length === 5){
            listOfCities.shift();
        }
         listOfCities.push(cityName);
         localStorage.setItem("ListOfCities", JSON.stringify(listOfCities));
         populateHistory();
    }
    
}


  
//* Coordinates from city
async function coordinatesFromCity(city) {
    if (!city) {
        console.error("Invalid city name");
        return;
    }
    
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;
    
    try {
        const response = await fetch(requestUrl);
        const data = await response.json();
        
        today.innerHTML = '';  // using 'today' variable
        forecast.innerHTML = '';  // using 'forecast' variable
        
        // renderButtonsFromLocalStorage();  
        getCurrentWeatherDetails(data[0].lat, data[0].lon);  
        getFiveDayForecast(data[0].lat, data[0].lon);  
        addCityToLocalStorage(city);
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

//* Current weather
async function getCurrentWeatherDetails(lat, lon) {
    const apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
    const queryParams = `?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;

    const requestUrl = `${apiEndpoint}${queryParams}`;

    try {
        const apiResponse = await fetch(requestUrl);
        if (!apiResponse.ok) throw new Error(`HTTP error! status: ${apiResponse.status}`);

        const weatherData = await apiResponse.json();

        const { main: { temp, humidity }, wind: { speed }, weather, name } = weatherData;
        const weatherIcon = weather[0].icon;

        const currentWeatherHtml = `
            <h2>${name} (As of ${new Date().toLocaleDateString()})</h2>
            <img src="https://openweathermap.org/img/w/${weatherIcon}.png">
            <p>Temperature: ${temp}&deg;F</p>
            <p>Wind Speed: ${speed}mph</p>
            <p>Humidity: ${humidity}%</p>
        `;

        today.classList.add("current-day-class");  
        today.innerHTML = currentWeatherHtml;

    } catch (error) {
        console.error("An error occurred while fetching data: ", error);
    }
}


//* Five day forecast
async function getFiveDayForecast(lat, lon) {
    const apiEndpoint = "https://api.openweathermap.org/data/2.5/forecast";
    const queryParams = `?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;

    const requestUrl = `${apiEndpoint}${queryParams}`;

    try {
        const apiResponse = await fetch(requestUrl);
        if (!apiResponse.ok) throw new Error(`HTTP error! status: ${apiResponse.status}`);

        const forecastData = await apiResponse.json();

        const forecastTitle = '<h2>5-Day Forecast:</h2>';
        fiveDayHeader.innerHTML = forecastTitle;

        forecast.innerHTML = '';  // Clear any existing forecast cards

        // Generate each card for the 5-day forecast
        for (let i = 3; i < forecastData.list.length; i += 8) {
            const { dt, main: { temp, humidity }, wind: { speed }, weather } = forecastData.list[i];
            const weatherIcon = weather[0].icon;

            const forecastCardHtml = `
                <div class="forecast-box col-2">
                    <h4 class="forecast-header">${new Date(dt * 1000).toLocaleDateString()}</h4>
                    <img src="https://openweathermap.org/img/w/${weatherIcon}.png">
                    <p>Temperature: ${temp}&deg;F</p>
                    <p>Wind Speed: ${speed}mph</p>
                    <p>Humidity: ${humidity}%</p>
                </div>
            `;

            forecast.innerHTML += forecastCardHtml;  // Append forecast card to the forecast element
        }

    } catch (error) {
        console.error("An error occurred while fetching data: ", error);
    }
}

coordinatesFromCity("san francisco");


