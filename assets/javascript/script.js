var APIKey = "960d808ec0452e361d474ea77ae8454c";
var city = "London"

var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";

fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // Extract the relevant weather information from the JSON data
        var temperature = data.main.temp;
        var weather_desc = data.weather[0].description;

        // Display the weather information to the user
        var weatherInfo = "Current weather in " + city + ": " + weather_desc + ", " + temperature + "°C";
        // Display the weatherInfo in app
        console.log(weatherInfo);
    })
    .catch(function (error) {
        // Display an error message to the user
        console.log("Error: Unable to retrieve weather information.");
    });