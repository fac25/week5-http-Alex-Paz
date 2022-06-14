//Create dropdown menu in JS
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
        output += `<option>${country}</option>`;
        selectDrop.innerHTML = output;
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

// Fetch from country api
const countryUrl = `https://restcountries.com/v3.1/name/spain`;

fetch(countryUrl)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const infoObj = {
      capital: data[0].capital,
      population: data[0].population,
      flag: data[0].flags.png,
      latitude: data[0].capitalInfo.latlng[0],
      longitude: data[0].capitalInfo.latlng[1],
    };
  })
  .catch((error) => console.log(error));
