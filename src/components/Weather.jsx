import React, { useEffect, useRef, useState } from 'react'
import './Weather.css' 

import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import search_icon from '../assets/search.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'

const Weather = () => {
   
  const inputRef = useRef()
   const[weatherData, setWeatherData] = useState(false);

   const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
   }

   const search = async(city)=>{
    if(city === ""){
      alert("Enter city name");
      return;
    }

    try{
        const url =`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);


       if(!response.ok){
        alert(data.message);
        return;
       }
   
    const dailyForecast = {};
    data.list.forEach((item) => {
      if (!item || !item.dt_txt) return; // skip if no date
      const date = item.dt_txt.split(" ")[0]; //to get the date part only
      if (!dailyForecast[date] && item.dt_txt.includes("12:00:00")) {
        dailyForecast[date] = item;
      }
    });

    const forecastArray = Object.values(dailyForecast).slice(0, 5); // get first five days

    const processedData = forecastArray.map((day) => ({
      date: day.dt_txt.split(" ")[0],
      temp: Math.round(day.main.temp),
      humidity: day.main.humidity,
      windSpeed: day.wind.speed,
      icon: allIcons[day.weather[0].icon] || clear_icon,
      description: day.weather[0].main
    }));

    setWeatherData({
      city: data.city.name,
      forecast: processedData
    });

  } catch(error){
    console.error("Error fetching forecast: ", error);
    setWeatherData(false);
  }
 };

   useEffect(() => {
     search("Istanbul");
   }, [])

    return (
    <div className='weather'>

        <div className='search-bar'>
            <input ref={inputRef} type='search' placeholder='Enter city'/> 
            <img src={search_icon} alt='' onClick={()=>search(inputRef.current.value)}/>
           </div>

    { weatherData && (
      <div className = "forecast-container">
        <h2> 5-Day forecast for {weatherData.city} </h2>
        <div className='forecast-grid'>
          {weatherData.forecast.map((day, index) => (
            <div className="forecast-card" key={index}> 
              <p>{day.date}</p>
              <img src={day.icon} alt={day.description} />
              <p>{day.temp}°C</p>
              <p>{day.humidity}% Humidity</p>
              <p>{day.windSpeed} km/h Wind</p>
              </div>
          ))}
      </div>
      </div>
    )
  }
</div> 
)
}


export default Weather