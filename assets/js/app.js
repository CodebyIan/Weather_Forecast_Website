/**
 * @license MIT
 * @copyright CodebyIan 2023 All rights reserved
 * @author CodebyIan <codebyian254@gmail.com>
 */

/*** Mode ***/
"use strict";

/*** Imports ***/
import { fetchData, url } from "./api.js";
import * as module from "./module.js";

/**
 * Add Event Listener On Multiple Elements
 * @param {NodeList} elements Elements Node Array
 * @param {string} eventType Event Type eg. "click
 * @param {function} callback Callback Function
 */

const addEventsOnElements = function (elements, eventType, callback) {
  for (const element of elements) {
    element.addEventListener(eventType, callback);
  }
};

/*** Toggle Search In Mobile Devices ***/
const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => {
  searchView.classList.toggle("active");
};

addEventsOnElements(searchTogglers, "click", toggleSearch);

/*** Search Integration ***/
const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener("input", function () {
  searchTimeout ?? clearTimeout(searchTimeout);

  if (!searchField.value) {
    searchResult.classList.remove("active");
    searchResult.innerHTML = "";
    searchField.classList.remove("searching");
  } else {
    searchField.classList.add("searching");
  }

  if (searchField.value) {
    searchTimeout = setTimeout(() => {
      fetchData(url.geo(searchField.value), function (locations) {
        searchField.classList.remove("searching");
        searchResult.classList.add("active");
        searchResult.innerHTML = `
        <ul class="view__list" data-search-list></ul>
        `;

        const items = [];

        for (const { name, lat, lon, country, state } of locations) {
          const searchItem = document.createElement("li");
          searchItem.classList.add("view__item");

          searchItem.innerHTML = `
          <span class="m__icon">Location_on</span>

          <div>
            <p class="item__title">${name}</p>
            <p class="label__2 item__subtitle">${state || ""} ${country}</p>
          </div>

          <a href="#/weather?lat=${lat}&lon=${lon}" class="item__link has__state"
          aria-label="${name} weather" data-search-toggler></a>
          `;

          searchResult
            .querySelector("[data-search-list]")
            .appendChild(searchItem);

          items.push(searchItem.querySelector("[data-search-toggler]"));
        }
        addEventsOnElements(items, "click", function () {
          toggleSearch();
          searchResult.classList.remove("active");
        });
      });
    }, searchTimeoutDuration);
  }
});

const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const errorContent = document.querySelector("[data-error-content]");
const currentLocationBtn = document.querySelector(
  "[data-current-location-btn]"
);

/**
 * Render All Weather Data In HTML Page
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 */
export const updateWeather = function (lat, lon) {
  loading.style.display = "grid";
  container.style.overflowY = "hidden";
  container.classList.remove("fade__in");
  errorContent.style.display = "none";

  const currentWeatherSection = document.querySelector(
    "[data-current-weather]"
  );
  const highlightSection = document.querySelector("[data-highlights]");
  const hourlySection = document.querySelector("[data-hourly-forecast]");
  const forecastSection = document.querySelector("[data-5-day-forecast]");

  currentWeatherSection.innerHTML = "";
  highlightSection.innerHTML = "";
  hourlySection.innerHTML = "";
  forecastSection.innerHTML = "";

  if (window.location.hash === "#/current-location") {
    currentLocationBtn.setAttribute("disabled", "");
  } else {
    currentLocationBtn.removeAttribute("disabled");
  }

  /**Current Weather Section **/
  fetchData(url.currentWeather(lat, lon), function (currentWeather) {
    const {
      weather,
      dt: dateUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone,
    } = currentWeather;

    const [{ description, icon }] = weather;

    const card = document.createElement("div");
    card.classList.add("card", "card__lg", "current__weather-card");
    card.innerHTML = `
    <h2 class="title__2 card__title">Now</h2>

      <div class="wrapper">
        <p class="heading">${parseInt(temp)}<sup>c</sup></p>
          <img src="./assets/images/weather_icons/${icon}.png"
            width="64"
            height="64"
            alt="${description}"
            class="weather__icon"
          />
    </div>

    <p class="body__3">${description}</p>

    <ul class="meta__list">
      <li class="meta__item">
        <span class="m__icon">calendar_today</span>

        <p class="title__3 meta__text">${module.getDate(dateUnix, timezone)}</p>
      </li>

      <li class="meta__item">
        <span class="m__icon">location_on</span>

        <p class="title__3 meta__text" data-location>Nairobi, Kenya</p>
      </li>
    </ul>
    `;
    fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
      card.querySelector("[data-location]").innerHTML = `${name}, ${country}`;
    });

    currentWeatherSection.appendChild(card);

    /** Today's Highlights **/
    fetchData(url.airPollution(lat, lon), function (airPollution) {
      const [
        {
          main: { aqi },
          components: { no2, o3, so2, pm2_5 },
        },
      ] = airPollution.list;

      const card = document.createElement("div");
      card.classList.add("card", "card__lg");

      card.innerHTML = `
  <h2 class="title__2" id="highlights-label">Todays Highlights</h2>

  <div class="highlight__list">
    <div class="card card__sm highlight__card one">
      <h3 class="title__3">Air Quality Index</h3>

        <div class="wrapper">
          <span class="m__icon">air</span>

          <ul class="card__list">
            <li class="card__item">
              <p class="title__1">${Number(pm2_5).toPrecision(3)}</p>

              <p class="label__1">PM<sub>2.5</sub></p>
            </li>

            <li class="card__item">
              <p class="title__1">${Number(so2).toPrecision(3)}</p>

              <p class="label__1">SO<sub>2</sub></p>
            </li>

            <li class="card__item">
              <p class="title__1">${Number(no2).toPrecision(3)}</p>

              <p class="label__1">NO<sub>2</sub></p>
            </li>

            <li class="card__item">
              <p class="title__1">${Number(o3).toPrecision(3)}</p>

              <p class="label__1">O<sub>2</sub></p>
            </li>
          </ul>
        </div>

        <span class="badge aqi__${aqi} label__${aqi}" title="${
        module.aqiText[aqi].message
      }">${module.aqiText[aqi].level}</span>
    </div>

<div class="card card__sm highlight__card two">
  <h3 class="title__3">Sunrise & Sunset</h3>

    <div class="card__list">
      <div class="card__item">
        <span class="m__icon">clear_day</span>

          <div>
            <p class="label__1">Sunrise</p>

            <p class="title__1">${module.getTime(sunriseUnixUTC, timezone)}</p>
          </div>
      </div>

      <div class="card__item">
        <span class="m__icon">clear_night</span>

          <div>
            <p class="label__1">Sunset</p>

            <p class="title__1">${module.getTime(sunsetUnixUTC, timezone)}</p>
          </div>
      </div>
</div>
</div>
           
<div class="card card__sm highlight__card">
  <h3 class="title__3">Humidity</h3>

    <div class="wrapper">
      <span class="m__icon">humidity_percentage</span>

        <p class="title__1">${humidity}<sub>%</sub></p>
    </div>
</div>

<div class="card card__sm highlight__card">
  <h3 class="title__3">Pressure</h3>

  <div class="wrapper">
    <span class="m__icon">airwave</span>

    <p class="title__1">${pressure}<sub>hPa</sub></p>
  </div>
</div>

<div class="card card__sm highlight__card">
  <h3 class="title__3">Visibility</h3>

  <div class="wrapper">
    <span class="m__icon">visibility</span>

    <p class="title__1">${visibility / 1000}<sub>km</sub></p>
  </div>
</div>

<div class="card card__sm highlight__card">
  <h3 class="title__3">Temperature</h3>

    <div class="wrapper">
      <span class="m__icon">thermostat</span>

      <p class="title__1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
    </div>
</div>
</div>
      `;
      highlightSection.appendChild(card);
    });

    /** 24H Forecast Section **/
    fetchData(url.forecast(lat, lon), function (forecast) {
      const {
        list: forecastList,
        city: { timezone },
      } = forecast;

      hourlySection.innerHTML = `
    <h2 class="title__2">Today At</h2>

      <div class="slider__container">
        <ul class="slider__list" data-temp></ul>

        <ul class="slider__list" data-wind></ul>
      </div>`;

      for (const [index, data] of forecastList.entries()) {
        if (index > 7) break;

        const {
          dt: dataTimeUnix,
          main: { temp },
          weather,
          wind: { deg: windDirection, speed: windSpeed },
        } = data;

        const [{ icon, description }] = weather;

        /* Temp List */
        const tempLi = document.createElement("li");

        tempLi.classList.add("slider__item");
        tempLi.innerHTML = `
    <div class="card card__sm slider__card">
      <p class="body__3">${module.getHours(dataTimeUnix, timezone)}</p>

      <img
        src="./assets/images/weather_icons/${icon}.png"
        width="48"
        height="48"
        loading="lazy"
        alt="${description}"
        class="weather__icon"
        title=${description}
      />

      <p class="body__3">${parseInt(temp)}&deg;c</p>
    </div>`;

        hourlySection.querySelector("[data-temp]").appendChild(tempLi);

        /* Wind List */
        const windLi = document.createElement("li");
        windLi.classList.add("slider__item");
        windLi.innerHTML = `
      <div class="card card__sm slider__card">
        <p class="body__3">${module.getHours(dataTimeUnix, timezone)}</p>

        <img
          src="./assets/images/weather_icons/direction.png"
          width="48"
          height="48"
          loading="lazy"
          alt="direction"
          class="weather__icon"
          style="transform: rotate(${windDirection - 180}deg)"
        />

        <p class="body__3">${parseInt(module.mps_to_Kmh(windSpeed))} km/h</p>
      </div>`;

        hourlySection.querySelector("[data-wind]").appendChild(windLi);
      }

      /** 5 Day Forecast Section **/
      forecastSection.innerHTML = `
      <h2 class="title__2" id="forecast-label">5 Days Forecast</h2>

      <div class="card card__lg forecast__card">
        <ul data-forecast-list></ul>
      </div>`;

      for (let i = 7, len = forecastList.length; i < len; i += 8) {
        const {
          main: { temp_max },
          weather,
          dt_txt,
        } = forecastList[i];

        const [{ icon, description }] = weather;
        const date = new Date(dt_txt);

        const li = document.createElement("li");
        li.classList.add("card__item");
        li.innerHTML = `
          <div class="icon__wrapper">
            <img
              src="./assets/images/weather_icons/${icon}.png"
              width="36"
              height="36"
              alt="${description}"
              class="weather__icon"
              title=${description}
            />

            <span class="span">
              <p class="title__2">${parseInt(temp_max)}&deg</p>
            </span>
          </div>

          <p class="label__1">${date.getUTCDate()} ${
          module.monthNames[date.getMonth()]
        }
          </p>

          <p class="label__1">${module.weekDayNames[date.getUTCDay()]}</p>
        `;

        forecastSection.querySelector("[data-forecast-list]").appendChild(li);
      }

      loading.style.display = "none";
      container.style.overflowY = "overlay";
      container.classList.add("fade__in");
    });
  });
};

export const error404 = () => (errorContent.style.display = "flex");
