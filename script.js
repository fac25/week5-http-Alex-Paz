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
