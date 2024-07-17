import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = process.env.REACT_APP_API_KEY;

  const fetchWeather = async () => {
    try {
      setError(''); // Reset error message
      let query = city;
      if (country) {
        query += `,${country}`;
      }

      console.log('Fetching current weather data...');
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`
      );
      console.log('Current weather data:', response.data);
      setWeatherData(response.data);

      console.log('Fetching forecast data...');
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}&units=metric`
      );
      console.log('Forecast data:', forecastResponse.data);
      setForecastData(forecastResponse.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data. Please try again.');
    }
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleSearch = () => {
    if (city.trim() === '') {
      setError('Please enter a city name.');
      return;
    }
    fetchWeather();
  };

  return (
    <div className="App">
      <h1>Weather Forecast</h1>
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Enter city"
      />
      <input
        type="text"
        value={country}
        onChange={handleCountryChange}
        placeholder="Enter country code (optional)"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div>
          <h2>Current Weather in {weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      )}
      {forecastData && (
        <div>
          <h2>5-day Forecast</h2>
          <Line
            data={{
              labels: forecastData.list.map(item =>
                new Date(item.dt * 1000).toLocaleString()
              ),
              datasets: [
                {
                  label: 'Temperature (°C)',
                  data: forecastData.list.map(item => item.main.temp),
                  fill: false,
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
