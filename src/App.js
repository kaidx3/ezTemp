import React, {useState} from 'react'
import axios from 'axios';
import Geocode from "react-geocode";

function App() {
  const [data, setData] = useState({})
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
      console.log(response.data)
    })
    setLocation('')
  }

  return (
    <div className="app">
      <div className="search">
        <input value={location} onChange={event => setLocation(event.target.value)} type="text" placeholder='Enter Location' onKeyPress={searchLocation}></input>
      </div>
      <div className="container"> 
        <div className="Top">
          <div className='location'> 
            <p>{ data.main ? `${data.name} ${data.sys.country}` : null}</p>
          </div>
          <div className='temp'> 
              {data.main ? <h1>{(data.main.temp - 273.15).toFixed(0)}°C</h1> : null}
          </div>
          <div className='description'> 
              {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>
        <div className='bottom'>
          <div className='feels'>
            {data.main ? <p>{(data.main.feels_like - 273.15).toFixed(0)}</p> : null}
          </div>
          <div className='humidity'>
            {data.main ? <p>{data.main.humidity}%</p> : null}
          </div>
          <div className='wind'>
            {data.wind ? <p>{data.wind.speed} mph</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
