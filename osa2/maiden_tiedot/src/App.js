import React, { useState, useEffect } from "react";
import axios from "axios";

const Filter = ({onChange}) => {
  return (
    <div>find countries <input onChange={onChange} /></div>
  )
}

const Weather = ({ country, weather }) => {  
  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      <p>
        <strong>temperature:</strong> {weather.current?.temperature} Celsius
      </p>
      <img src={weather.current?.weather_icons[0]} alt="weather icon"/>
      <p>
        <strong>wind:</strong> {weather.current?.wind_speed} mph direction {weather.current?.wind_dir}
      </p>
    </div>
  );
};

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h2>Spoken languages</h2>
      <ul>
        {country.languages.map((lang) => (
          <li key={lang.name}>{lang.name}</li>
        ))}
      </ul>
      <img src={country.flag} width={100} alt="country flag"/>
    </div>
  );
};

const Countries = ({ countries, setCountryFilter }) => {
  return (
    <table>
      <tbody>
        {countries.map((country) => {
          return (
            <tr key={country.name}>
              <td>{country.name}</td>
              <td>
                <button onClick={() => setCountryFilter(country.name)}>
                  show
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [weather, setWeather] = useState([]);
  
  useEffect(() => {
    if (countriesToShow.length === 1) {
      axios
      .get(
        `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${countriesToShow[0].name}`
      )
      .then((response) => {
        console.log(response.data);
        setWeather(response.data);
      }); 
    }
    
  }, [filterText]);
  
  useEffect(() => {
    console.log("Effect!");
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      console.log("promise fulfilled!");
      setCountries(response.data);
    });
  }, []);

  const handleFilterChange = (event) => {
    console.log(event.target.value);
    setFilterText(event.target.value);
  };

  const countriesToShow = countries.filter((country) =>
    country.name.toLowerCase().includes(filterText.toLowerCase())
  );

  if (countriesToShow.length > 10) {
    return (
      <div>
        <Filter onChange={handleFilterChange} />
        <p>Too many matches, specify your another filter</p>
      </div>
    );
  } else if (countriesToShow.length > 1) {
    return (
      <div>
        <Filter onChange={handleFilterChange} />
        <Countries
          countries={countriesToShow}
          setCountryFilter={setFilterText}
        />
      </div>
    );
  } else if (countriesToShow.length === 1) {
    return (
      <div>
        <Filter onChange={handleFilterChange} />
        <Country country={countriesToShow[0]} />
        <Weather country={countriesToShow[0]} weather={weather}/>
      </div>
    );
  } else {
    return <div>find countries <input onChange={handleFilterChange} /></div>;
  }

};

export default App;
