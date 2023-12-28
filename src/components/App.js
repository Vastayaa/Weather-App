import { useState } from 'react';
import axios from 'axios';
import './App.css';

export const App = () => {
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [isError, setIsError] = useState(false);
  const [idError, setIdError] = useState(-1);
  const changeCityInput = (e) => { setCityName(e.target.value) };
  const fetchProxyAPI = async() => {
    try {
      let resp = await axios.post('http://localhost:5000/api', { text: cityName });
      resp.data.state === 200? setWeatherData(resp.data.data) : setIsError(true); setIdError(resp.data.state);
    } catch(e) { setIsError(true); setIdError(599) }
  }

  let onEnter = (e) => { if (e.keyCode === 13 && cityName.length > 0) { fetchProxyAPI() } else { setWeatherData("undefined"); setIsError(false) } };

  let dateBuilder = () => {
    let d = new Date(), months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], day = days[d.getDay()], date = d.getDate(), month = months[d.getMonth()], year = d.getFullYear();
    return `${day}, ${date} ${month} ${year}`;
  }

  return (
    <div className="wrapper">
      <div className="mainWindow">
        <div className={typeof weatherData.main == "undefined" ? 'background' : Math.round(weatherData.main.temp-273.15) > 0 ? 'background heap': 'background cold' }></div>
        <input type="text" className="header" id="header" placeholder="Search" onChange={changeCityInput} onKeyDown={onEnter} value={cityName}/>
        {
          isError ? ( 
            <img className="errWrap" src={`/assets/${idError}.jpg`} alt="err" />
          ):
          typeof weatherData.main=="undefined" ? ( null ):
          (
            <>
              <div className="locationBox">
                <div className="location">{`${weatherData.name}, ${weatherData.sys.country}`}</div>
                <div className="date">{ dateBuilder() }</div>
              </div>
  
              <div className="weatherBox">
                <div className="temp">{ Math.round(weatherData.main.temp-273.15) }°c</div>
                <div className="weather">{ weatherData.weather[0].main }</div>
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}

