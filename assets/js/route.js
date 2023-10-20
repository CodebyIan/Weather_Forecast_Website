/**
 * @license MIT
 * @fileoverview Menage all routes
 * @copyright CodebyIan 2023 All rights reserved
 * @author CodebyIan <codebyian254@gmail.com>
 */

/*** Mode ***/
"use strict";

/*** Import ***/
import { updateWeather, error404 } from "./app.js";

const defaultLocation = "#/weather?lat=-1.2920659&lon=36.82194619999996"; // London

const currentLocation = function () {
  window.navigator.geolocation.getCurrentPosition(
    (res) => {
      const { latitude, longitude } = res.coords;

      updateWeather(`lat=${latitude}`, `lon=${longitude}`);
    },
    (err) => {
      window.location.hash = defaultLocation;
    }
  );
};

/**
 *
 * @param {string} query Searched Query
 */
const searchLocation = (query) => {
  // UpdateWeather("lat=-1.2920659","lon=36.82194619999996")
  updateWeather(...query.split("&"));
};

const routes = new Map([
  ["/current-location", currentLocation],
  ["/weather", searchLocation],
]);

const checkHash = function () {
  const requestURL = window.location.hash.slice(1);

  const [route, query] = requestURL.includes
    ? requestURL.split("?")
    : [requestURL];

  routes.get(route) ? routes.get(route)(query) : error404();
};

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function () {
  if (!window.location.hash) {
    this.window.location.hash = "#/current-location";
  } else {
    checkHash();
  }
});
