const header = document.querySelector("h2");
const info = document.querySelector(".info");
const forecast = info.querySelector(".forecast");

const form = document.querySelector("form");
const input = form.querySelector("input");

const swap = document.querySelector("#swap");

let unit = "Celsius";
let currentData = undefined;

async function getLocation(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=GRTEBFY6ZGNL94HXTK3K64FPZ&contentType=json`,
    { mode: "cors" }
  );

  const data = await response.json();
  return data;
}

function processData(data) {
  const res = {
    location: data.resolvedAddress,
    condition: data.currentConditions.conditions,
    description: data.description,
    temp: data.currentConditions.temp,
    days: [],
  };

  for (let i = 0; i < 7; i++) {
    const day = data.days[i];
    res.days.push({
      date: day.datetime,
      conditions: day.conditions,
      tempmin: day.tempmin,
      tempmax: day.tempmax,
    });
  }

  currentData = res;

  return res;
}

function getTemp(degrees) {
  if (unit == "Celsius") {
    return degrees;
  }

  return Math.round(((degrees * 9) / 5 + 32) * 100) / 100;
}

function displayData(data) {
  header.textContent = data.location;

  info.querySelector(".temp").textContent = `${getTemp(
    data.temp
  )} degrees ${unit}`;
  info.querySelector(".condition").textContent = data.condition;
  info.querySelector(".desc").textContent = data.description;

  while (forecast.children.length > 0) {
    forecast.removeChild(forecast.children[0]);
  }

  for (const day of data.days) {
    const container = document.createElement("div");

    const date = document.createElement("h4");
    date.textContent = day.date;
    container.appendChild(date);

    const temp = document.createElement("p");
    temp.textContent = `Min temp of ${getTemp(
      day.tempmin
    )} degrees ${unit} and max temp of ${getTemp(day.tempmax)} degrees ${unit}`;
    temp.classList.add("temp");
    container.appendChild(temp);

    const conditions = document.createElement("p");
    conditions.textContent = day.conditions;
    container.appendChild(conditions);

    forecast.appendChild(container);
  }

  info.style.visibility = "visible";
}

function displayLocation(location) {
  getLocation(location)
    .then((data) => processData(data))
    .then((data) => displayData(data))
    .catch(() => {
      header.textContent = "Data for this location could not be displayed.";
      info.style.visibility = "hidden";
    });
}

swap.addEventListener("click", () => {
  if (unit == "Celsius") {
    unit = "Fahrenheit";
  } else {
    unit = "Celsius";
  }

  const temp = info.querySelector(".temp");
  temp.textContent = `${getTemp(currentData.temp)} degrees ${unit}`;

  for (let i = 0; i < forecast.children.length; i++) {
    const container = forecast.children[i];
    const day = currentData.days[i];

    container.querySelector(".temp").textContent = `Min temp of ${getTemp(
      day.tempmin
    )} degrees ${unit} and max temp of ${getTemp(day.tempmax)} degrees ${unit}`;
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("bruh");
  displayLocation(input.value);
});

displayLocation("milan");
