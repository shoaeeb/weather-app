'use strict';
//5859a4c9d7f449e996986e8ce6e7162d
const weatherCurrent = document.querySelector('.weather--current');
weatherCurrent.innerHTML = '';
const form = document.querySelector('form');
const inputPlace = document.querySelector('input');
const container = document.querySelector('.container');
const addMore = document.querySelector('.addMore');
class Weather {
  static weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  constructor() {
    this._getCurrentPosition();
    form.addEventListener('submit', this._handlerFunction.bind(this));
    addMore.addEventListener('click', this._moreCities.bind(this));
  }

  //get the current position of the user and display the current weather of that place
  async _getCurrentPosition() {
    try {
      const position = await this._getCurrentPositionAsync();
      let { latitude: lat, longitude: long } = position.coords;
      this._lat = lat;
      this._lon = long;
      let data = await this._getWeatherCondition(this._lat, this._lon);
      data = data.data[0];
      this._renderWeatherData(data, weatherCurrent, 'flex');
      Promise.all([
        this._getCurrentWeather('Washington,USA', container, 'flex'),
        this._getCurrentWeather('Tokyo,Japan', container, 'flex'),
        this._getCurrentWeather('London,England', container, 'flex'),
        this._getCurrentWeather('New York,USA', container, 'flex'),
        this._getCurrentWeather('Paris,France', container, 'flex'),
      ]);

      this._get;
      //   await this._getWeatherConditionXml(this._lat, this._lon);
    } catch (error) {
      console.log(error);
    }
  }
  _getCurrentPositionAsync() {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error)
      );
    });
  }

  async _getWeatherCondition(lat, lon) {
    const API_URL = `https://api.weatherbit.io/v2.0/current?lat=${lat}6&lon=${lon}&key=${allKeys.API_KEY}
  `;
    ('https://api.weatherbit.io/v2.0/forecast/hourly?city=Raleigh,NC&key=API_KEY&hours=48');
    let res = await fetch(API_URL);
    let data = await res.json();
    return data;
  }

  _validateInput(input) {
    console.log(inputPlace === input);
    let userInput = inputPlace === input ? inputPlace.value : input;
    if (!userInput.includes(',')) return;
    this._userInput = userInput;
    inputPlace.value = '';
    console.log('valid', this._userInput);
  }

  _moreCities(e) {
    e.preventDefault();
    let name = prompt('Enter City,Country');
    this._validateInput(name);
    this._getCurrentWeather(this._userInput, container, 'flex');
  }
  _handlerFunction(e) {
    e.preventDefault();
    this._validateInput(inputPlace);

    this._getCurrentWeather(this._userInput, weatherCurrent, 'yourSearches');
  }

  async _getCurrentWeather(location, element, className) {
    let [city, country] = location.split(',');
    // this.localTime = this._getTimeForCountry(country);

    const URL = `https://api.weatherbit.io/v2.0/forecast/hourly?city=${city}&country=${country},NC&key=${allKeys.API_KEY}&hours=48
    `;
    try {
      const resp = await fetch(URL);
      if (!resp.ok) {
        throw new Error('Something Went Wrong');
      }
      const data = await resp.json();
      this._response = data.data[0];
      console.log(this._response);
    } catch (error) {
      console.log(error.message);
    }
    this._renderWeatherData(this._response, element, className, city);
  }

  //display the weather data on the UI
  async _renderWeatherData(data, element, className, cityName) {
    // weatherCurrent.innerHTML = '';
    await this._getTimeByCity(data.city_name || cityName);
    console.log(this.str);
    let h4 = '';
    if (data.lat && data.lon) {
      let textContent =
        data.lon.toFixed(3) == this._lon.toFixed(3) &&
        data.lat.toFixed(3) == +this._lat.toFixed(3)
          ? 'Current Location'
          : '';
      h4 += `<h4>${textContent}</h4>`;
    }

    let html = `
    <div class=${className}>
    ${h4}
    <h1>City:  ${
      data.city_name ||
      cityName.slice(0, 1).toUpperCase() + '' + cityName.slice(1)
    }</h1>
    <div class="display">
    
    <h5>${this.str || Weather.weekdays[new Date().getDay()]}</h5>
    <h5>${
      this.date ||
      new Intl.DateTimeFormat(navigator.locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date())
    }</h5>
      <p>Feels like ${data.temp}° C</p>
      <p>${data.weather.description}</p>
      <p>Wind Speed: ${data.wind_spd} m/s </p>
      <p>Wind Direction: ${data.wind_dir} °</p>
      <p>Visiblity: ${data.vis} KM</p>
    </div>`;
    html += `<div class="icon">
    <img src="./img/${data.weather.icon}.png" alt="icon" />
  </div>
  </div>
  `;

    element.insertAdjacentHTML('beforeend', html);
    element.style.backgroundColor = 'transparent';
    return true;
  }

  async _getTimeByCity(city) {
    const API_URL = ``;
    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/worldtime?city=${city}`,
        {
          method: 'GET',
          headers: { 'X-Api-Key': `${allKeys.cityAPI_KEY}` },
          contentType: 'application/json',
        }
      );
      if (!response.ok) {
        throw new Error('Something Went Wrong');
      }
      const result = await response.json();
      this.str = `${
        Weather.weekdays[new Date(result.datetime).getDay()]
      },${new Date(result.datetime)
        .getHours()
        .toString()
        .padStart(2, 0)}:${new Date(result.datetime)
        .getMinutes()
        .toString()
        .padStart(2, 0)}`;
      this.date = `${new Intl.DateTimeFormat(navigator.locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(result.datetime))}`;
      console.log(this.str);
      console.log(this.date);
    } catch (error) {
      console.log(error.message);
    }
  }
}

const weather = new Weather();
