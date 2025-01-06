const header = document.querySelector("h2");
const info = document.querySelector(".info");

async function getLocation(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=GRTEBFY6ZGNL94HXTK3K64FPZ&contentType=json`,
    { mode: "cors" }
  );

  const data = await response.json();
  return data;
}

function processData(data) {
  console.log(data);
  const res = {
    location: data.resolvedAddress,
    conidtion: data.currentConditions.conditions,
    description: data.description,
    temp: data.currentConditions.temp,
    days: [],
  };

  data.days.forEach((day) => {
    res.days.push({
      date: day.datetime,
      conditions: day.conditions,
      description: day.description,
      tempmin: day.tempmin,
      tempmax: day.tempmax,
    });
  });

  return res;
}

function displayData(data) {
    header.textContent = data.location;
    
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

displayLocation("paris");
