//HELPER FUNCTIONS
function addCommas(nStr) {
  nStr += "";
  x = nStr.split(".");
  x1 = x[0];
  x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}
// NEWS CARDS
const timeContainer = document.querySelector("#time");
const dataContainer = document.querySelector("#datacontainer");
//const mapDiv = document.getElementById("osm-map");
let newsArr = [];

function showNews(countryName) {
  const news = countryName.response.results;

  news.forEach((element) => {
    let sectionName = element.sectionName;
    let webPublicationDate = new Date(element.webPublicationDate).toUTCString();
    webPublicationDate = webPublicationDate.split(" ").slice(0, 4).join(" ");
    let webTitle = element.webTitle;
    let webUrl = element.webUrl;

    let card = document.createElement("div");
    card.classList = "card";
    let cardContent = `<div class="tags">
        <span>${sectionName}</span>
        <span>${webPublicationDate}</span></div>
        <h2><a href="${webUrl}" target="_blank">${webTitle} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-right-square-fill" viewBox="0 0 16 16">
        <path d="M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12zM5.904 10.803 10 6.707v2.768a.5.5 0 0 0 1 0V5.5a.5.5 0 0 0-.5-.5H6.525a.5.5 0 1 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 .707.707z"/>
      </svg></a></h2>
       `;
    card.innerHTML = cardContent;
    dataContainer.appendChild(card);
  });
}

function showTime(time) {
  let card = document.createElement("span");
  let cardContent = `${time}`;
  card.innerHTML = cardContent;
  timeContainer.appendChild(card);
}

function showFacts(countryFacts) {
  let population = addCommas(countryFacts.population);

  let currency = countryFacts.currency;
  let language = countryFacts.language.join(", ");

  let card = document.createElement("div");

  card.classList = "card card_facts";

  let cardContent = `
       <div class="card_facts-image"><img src="${countryFacts.flag}" alt="${countryFacts.country} flag" /></div>
        <h2>${countryFacts.country}</h2>
        <div class="row">
        <div class="col">
          <div class="">
            <span>Capital</span>
            <p>${countryFacts.capital}</p>
          </div>
          <div class="">
          <span>Latitude / Longitude</span>
          <p>${countryFacts.latitude} / ${countryFacts.longitude}</p>
        </div>
          
        </div>
        <div class="col">
        <div class="">
            <span>Population</span>
            <p>${population}</p>
          </div>
        <div class="">
          <span>Continent</a></span>
          <p>${countryFacts.continent}</p>
        </div>
      </div>
      <div class="col">
      <div class="">
        <span>Language/s</span>
        <p>${language} </p>
      </div>
      <div class="">
        <span>Currency</span>
        <p>${countryFacts.currency}</p>
      </div>
    </div>
    </div>
      `;
  card.innerHTML = cardContent;
  dataContainer.appendChild(card);

  // Map created with https://leafletjs.com/
  // Where you want to render the map.
  // mapDiv.innerHTML = "";

  // Height has to be set. You can do this in CSS too.
  // mapDiv.style = "height:300px;";

  // Create Leaflet map on map element.
  //let map = L.map(mapDiv);

  // Add OSM tile layer to the Leaflet map.
  // L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  //   attribution:
  //     '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  // }).addTo(map);

  // Target's GPS coordinates.
  // var target = L.latLng(
  //   `${countryFacts.latitude}`,
  //   `${countryFacts.longitude}`
  // );

  // Set map's center to target with zoom 14.
  // map.setView(target, 4);

  // Place a marker on the same location.
  //// L.marker(target).addTo(map);
}
// Error output
const errorOutput = document.querySelector("output");
// Fetch from country api
let infoObj = {};
function cardsAndNewsFetch(country) {
  hideLoading();
  const countryUrl = `https://restcountries.com/v3.1/name/${country}?fullText=true`;
  const guardianURL = `https://content.guardianapis.com/search?section=world&q=${country}&api-key=b2cce45c-d598-4746-9bb0-676b8ea3b67d`;
  //
  fetch(countryUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const currencyCode = Object.keys(data[0].currencies);
      const languageCode = Object.keys(data[0].languages);
      let language = [];
      languageCode.map((code) => {
        language.push(data[0].languages[code]);
      });
      infoObj = {
        continent: data[0].continents,
        countryName: data[0].name.official,
        country: data[0].name.common,
        currency: data[0].currencies[currencyCode].name,
        capital: data[0].capital,
        language: language,
        population: data[0].population,
        flag: data[0].flags.png,
        latitude: data[0].capitalInfo.latlng[0],
        longitude: data[0].capitalInfo.latlng[1],
        map: data[0].maps.googleMaps,
      };
      showFacts(infoObj);
      return infoObj;
    })
    .then(
      fetch(guardianURL)
        .then((response) => {
          return response.json();
        })
        .then((countryNews) => {
          showNews(countryNews);
          // console.log(countryNews);
        })
    )
    // if the request is unsuccessful
    .catch((error) => {
      console.log(error);
      if (error.message === "404") {
        errorOutput.textContent = `⚠️ Couldn't find "${country}"`;
      } else {
        errorOutput.textContent = "⚠️ Something went wrong";
      }
    });
}

//Loading functions
const loader = document.getElementById("loading");

function displayLoading() {
  loader.style.display = "block";
  loader.classList.add("display");
}
function hideLoading() {
  loader.style.display = "none";
}
//Time on load
const countryArray = [];
const selectDrop = document.getElementById("countries");

document.addEventListener("DOMContentLoaded", () => {
  displayLoading();
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let output = " ";
      data.map((country) => {
        countryArray.push(country.name.common);
      });
      countryArray.sort().forEach((country) => {
        // output += `<option value="${country}">${country}</option>`;
        selectDrop.innerHTML += `<option value="${country}">${country}</option>`;
      });
    })
    .then(
      fetch("https://api.ipify.org/?format=json")
        .then((response) => response.json())
        .then((data) => data.ip)
        .then((ip) => {
          getTimeOnLoad(ip);
        })
    )
    .catch((error) => {
      console.log(error);
    });
});

function getTimeOnLoad(ip) {
  timeContainer.innerHTML = "";
  fetch(
    `https://api.ipgeolocation.io/ipgeo?ip=${ip}&apiKey=1da0e66d8c6e4cb08f8b2086326b20b6`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      infoObj1 = {
        capital: data.country_capital,
        country: data.country_name,
        time: data.time_zone.current_time.slice(11, 16),
      };
      cardsAndNewsFetch(infoObj1.country, infoObj1.time);
      showTime(infoObj1.time);
      return infoObj1;
    });
}

function getTimeAfterCountryChosen(country) {
  timeContainer.innerHTML = "";
  const countryUrl = `https://restcountries.com/v3.1/name/${country}?fullText=true`;

  fetch(countryUrl)
    .then((response) => response.json())
    .then((data) => data[0].capital.toString())
    .then((capital) =>
      fetch(
        `https://api.ipgeolocation.io/timezone?apiKey=1da0e66d8c6e4cb08f8b2086326b20b6&location=${capital},%20${country}`
      )
        .then((response) => response.json())
        .then((data) => {
          showTime(data.time_24.slice(0, 5));
        })
    );
}

selectDrop.addEventListener("change", (e) => {
  displayLoading();
  // clear out any previous results
  errorOutput.innerHTML = "";
  dataContainer.innerHTML = "";
  let country = e.target.value;
  let noWhitespace = country.replace(/\s/g, "%20");
  cardsAndNewsFetch(noWhitespace);
  getTimeAfterCountryChosen(noWhitespace);
});
