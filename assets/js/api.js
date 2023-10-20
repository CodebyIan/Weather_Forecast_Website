/**
 * @license MIT
 * @fileoverview All api related stuff like api_key, api request etc.
 * @copyright CodebyIan 2023 All rights reserved
 * @author CodebyIan <codebyian254@gmail.com>
 */

"use strict";
/** API Key **/
const api_key = "79f4a5c77f28637217a8bb3c01ba1020";

/**
 * fetchData From Server
 * @param {string} URL API URL
 * @param {function} callback Callback Function
 */

/** Export **/
export const fetchData = function (URL, callback) {
  fetch(`${URL}&appid=${api_key}`)
    .then((res) => res.json())
    .then((data) => callback(data));
};

export const url = {
  currentWeather(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`;
  },

  forecast(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
  },

  airPollution(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
  },

  reverseGeo(lat, lon) {
    return `https://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`;
  },

  /**
   *
   * @param {string} query Search query e.g: "Kenya", "New York"
   * @returns
   */

  geo(query) {
    return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
  },
};
