/**
 * @license MIT
 * @fileoverview All module functions
 * @copyright CodebyIan 2023 All rights reserved
 * @author CodebyIan <codebyian254@gmail.com>
 */

/** Mode **/
"use strict";

/** Exports **/
export const weekDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 *
 * @param {number} dateUnix Unix Date In Seconds
 * @param {number} timeZone Timezone shift from UTC In Seconds
 * @returns {string} Date String Formate: "Sun 10, Jan"
 */

export const getDate = function (dateUnix, timeZone) {
  const date = new Date((dateUnix + timeZone) * 1000);
  const weekDayName = weekDayNames[date.getUTCDay()];
  const monthName = monthNames[date.getUTCMonth()];

  return `${weekDayName} ${date.getUTCDate()}, ${monthName}`;
};

/**
 *
 * @param {number} timeUnix Unix Date In Seconds
 * @param {number} timeZone Timezone Shift From UTC In Seconds
 * @returns {string} Time String Formate: "HH:MM AM/PM"
 */

export const getTime = function (timeUnix, timeZone) {
  const date = new Date((timeUnix + timeZone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  return `${hours % 12 || 12}: ${minutes} ${period}`;
};

/**
 *
 * @param {number} timeUnix Unix Date In Seconds
 * @param {number} timeZone Timezone Shift From UTC In Seconds
 * @returns {string} Time String Formate: "HH AM/PM"
 */

export const getHours = function (timeUnix, timeZone) {
  const date = new Date((timeUnix + timeZone) * 1000);
  const hours = date.getUTCHours();
  const period = hours >= 12 ? "PM" : "AM";

  return `${hours % 12 || 12} ${period}`;
};

/**
 *
 * @param {number} mps Metres Per Second
 * @returns {number} Kilometers Per Hour
 */

export const mps_to_Kmh = (mps) => {
  const mph = mps * 3600;
  return mph / 1000;
};

export const aqiText = {
  1: {
    level: "Good",
    message:
      "Air quality is considered satisfactory, the air pollution poses little or no risk.",
  },

  2: {
    level: "Fair",
    message:
      "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.",
  },

  3: {
    level: "Moderate",
    message:
      "Members of sensitive groups may experience health effects. The general public is not likely to be affected.",
  },

  4: {
    level: "Poor",
    message:
      "Everyone may begin to experience health effects. The general public is not likely to be affected.",
  },

  5: {
    level: "Very Poor",
    message:
      "Health warnings of emergency conditions. The entire population is more likely to be affected.",
  },
};
