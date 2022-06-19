//Time on load
const errorOutput = document.querySelector("output");
const countryArray = [];
const selectDrop = document.getElementById("countries");
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let output = "";
      data.map((country) => {
        countryArray.push(country.name.common);
      });
      countryArray.sort().forEach((country) => {
        output += `<option value="${country}">${country}</option>`;
        selectDrop.innerHTML = output;
      });
    })
    .then(
      fetch("https://api.ipify.org/?format=json")
        .then((response) => response.json())
        .then((data) => data.ip)
        .then((ip) => {
          getTime("ip", ip);
        })
    )
    .catch((error) => {
      console.log(error);
    });
});

function getTime(param1, param2) {
  timeContainer.innerHTML = "";
  fetch(
    `https://api.ipgeolocation.io/ipgeo?apiKey=1da0e66d8c6e4cb08f8b2086326b20b6&${param1}=${param2}`
  )
    .then((response) => response.json())
    .then((data) => {
      dataObj(data);
      cardsAndNewsFetch(infoObj.country, infoObj.time);
      showTime(infoObj.time);
    });
}

function dataObj(obj) {
  const infoObj = {
    capital: obj.country_capital,
    country: obj.country_name,
    time: obj.time_zone.current_time.slice(11, 19),
  };
  return infoObj;
}

console.log(dataObj);
