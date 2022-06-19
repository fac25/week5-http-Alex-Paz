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
          fetch(
            `https://api.ipgeolocation.io/ipgeo?apiKey=1da0e66d8c6e4cb08f8b2086326b20b6&ip=${ip}`
          )
            .then((response) => response.json())
            .then((data) => {
              const infoObj = {
                capital: data.country_capital,
                country: data.country_name,
                time: data.time_zone.current_time.slice(11, 19),
              };
              console.log(infoObj);
            });
        })
    )
    .catch((error) => {
      console.log(error);
    });
});
