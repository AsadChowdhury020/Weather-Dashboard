import { useState } from "react";

export default function App() {
  // State to store the city name entered by the user
  const [city, setCity] = useState("");

  // State to store fetched weather data from API
  const [weather, setWeather] = useState(null);

  // State to show loading message while API request is running
  const [loading, setLoading] = useState(false);

  // State to show error messages like invalid city or API issues
  const [error, setError] = useState("");

  // OpenWeatherMap API key
  const API_KEY = "7a120b8b3718c90567c5c1c529653d1d";

  // Function to fetch weather data from API
  const fetchWeather = async () => {
    
    // Check if input field is empty
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    // Start loading state
    setLoading(true);

    // Clear previous error
    setError("");

    // Clear old weather data before new search
    setWeather(null);

    try {
      // API request to fetch weather data by city name
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      // Handle invalid city name error
      if (response.status === 404) {
        throw new Error("Invalid city name");
      }

      // Handle API request limit exceeded
      if (response.status === 429) {
        throw new Error("API limit exceeded");
      }

      // Handle invalid API key error
      if (response.status === 401) {
        throw new Error("Invalid API key");
      }

      // Handle unexpected errors
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      // Convert response to JSON format
      const data = await response.json();

      // Store API data into weather state
      setWeather(data);

    } catch (err) {
      // Show error message if request fails
      setError(err.message || "Network failure");

    } finally {
      // Stop loading state after request is completed
      setLoading(false);
    }
  };

  // Allow user to press Enter key to search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-200 flex items-center justify-center p-4">
      
      {/* Main weather app container */}
      <div className="w-full max-w-lg rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl border border-white/40 p-8">
        
        {/* App heading section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Weather Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Search real-time weather information by city
          </p>
        </div>

        {/* Search input and button */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={fetchWeather}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Loading state message */}
        {loading && (
          <div className="rounded-2xl bg-blue-50 p-4 text-center text-blue-700 font-medium">
            Loading weather data...
          </div>
        )}

        {/* Error state message */}
        {error && (
          <div className="rounded-2xl bg-red-50 p-4 text-center text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Success state - Display weather details */}
        {weather && (
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 shadow-lg">
            
            {/* City name and current temperature */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">
                  {weather.name}
                </h2>
                <p className="text-blue-100 mt-1">
                  {weather.weather[0].description}
                </p>
              </div>

              <div className="text-5xl font-bold">
                {Math.round(weather.main.temp)}°C
              </div>
            </div>

            {/* Weather information cards */}
            <div className="grid grid-cols-2 gap-4">

              {/* Humidity */}
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-sm text-blue-100">Humidity</p>
                <p className="text-xl font-semibold">
                  {weather.main.humidity}%
                </p>
              </div>

              {/* Wind speed */}
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-sm text-blue-100">Wind Speed</p>
                <p className="text-xl font-semibold">
                  {weather.wind.speed} m/s
                </p>
              </div>

              {/* Feels like temperature */}
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-sm text-blue-100">Feels Like</p>
                <p className="text-xl font-semibold">
                  {Math.round(weather.main.feels_like)}°C
                </p>
              </div>

              {/* Weather condition */}
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-sm text-blue-100">Condition</p>
                <p className="text-xl font-semibold">
                  {weather.weather[0].main}
                </p>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}