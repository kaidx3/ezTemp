import React, {useState} from 'react'
import axios from 'axios';
import Geocode from "react-geocode";
import cloudyImage from "./assets/wi-cloudy.svg";
import sunnyImage from "./assets/wi-day-sunny.svg"
import rainyImage from "./assets/wi-showers.svg"
import snowyImage from "./assets/wi-snow-wind.svg"

function App() {
  const [data, setData] = useState({})
  const [weatherImage, setWeatherImage] = useState('')
  let latitude
  let longitude
  const [location, setLocation] = useState('')
  Geocode.setApiKey('AIzaSyCZd2lKTv-fsIDH-nQjYkckN2G31y6bloU')

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      Geocode.fromAddress(location).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          latitude = lat
          longitude = lng
          getCityDataFromCoords()
        },
        (error) => {
          console.error(error);
        }
      )
    }
  }

  const getCityDataFromCoords = () => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=2f7da05d2c6127b84619fafd58094128`).then((response) => {
      setData(response.data)
      updateWeatherImage(response.data)
    })
    setLocation('')
  }

  const updateWeatherImage = (data) => {
    if (data.weather[0].main == "Clouds" || data.weather[0].main == "Mist"){
      setWeatherImage(cloudyImage)
      document.body.style.backgroundColor = "grey";
    }
    if (data.weather[0].main == "Clear"){
      setWeatherImage(sunnyImage)
      document.body.style.backgroundColor = "orange";
    }
    if (data.weather[0].main == "Rain"){
      setWeatherImage(rainyImage)
      document.body.style.backgroundColor = "#53789e";
    }
    if (data.weather[0].main == "Snow"){
      setWeatherImage(snowyImage)
      document.body.style.backgroundColor = "#C0F6FB";
    }
  }

  return (
    <div className="app">
      <div className="search">
        <input value={location} onChange={event => setLocation(event.target.value)} type="text" placeholder='Enter Location' onKeyPress={searchLocation}></input>
      </div>
      <div className="container"> 
        <img src={weatherImage} alt=""></img>
        <div className="Top">
          <div className='location'> 
            <p>{ data.main ? `${data.name}` : null}</p>
          </div>
          <div className='middle'>
            <div className='temp'> 
                {data.main ? <h1>{(data.main.temp - 273.15).toFixed(0)}°C</h1> : null}
            </div>
            <div className='description'> 
                {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>
        </div>
        <div className='bottom'>
          <div className='feels'>
            {data.main ? <p>Feels like: <br/> {(data.main.feels_like - 273.15).toFixed(0)}°C</p> : null}
          </div>
          <div className='humidity'>
            {data.main ? <p>Humidity: <br/> {data.main.humidity}%</p> : null}
          </div>
          <div className='wind'>
            {data.wind ? <p>Wind: <br/> {data.wind.speed} mph</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
