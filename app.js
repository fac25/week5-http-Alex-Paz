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
const dataContainer = document.querySelector("#datacontainer");
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
        <h2><a href="${webUrl}">${webTitle}</a></h2>
       `;
    card.innerHTML = cardContent;
    dataContainer.appendChild(card);
  });
}
function showFacts(countryFacts) {
  let population = addCommas(countryFacts.population);
  let card = document.createElement("div");
  card.classList = "card card_facts";
  let cardContent = `
        <img src="${countryFacts.flag}" alt="${countryFacts.country} flag" />
        <h2>${countryFacts.country}</h2>
        <div class="">
          <div class="">
            <span>Capital</span>
            <p>${countryFacts.capital}</p>
          </div>
          <div class="">
            <span>Population</span>
            <p>${population}</p>
          </div>
        </div>
      `;
  card.innerHTML = cardContent;
  dataContainer.appendChild(card);
}
//Create dropdown menu with list of countries
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
    .catch((error) => {
      console.log(error);
    });
});
// Fetch from country api
selectDrop.addEventListener("change", (e) => {
  // clear out any previous results
  dataContainer.innerHTML = "";

  let country = e.target.value;
  let noWhitespace = country.replace(/\s/g, "%20");
  const countryUrl = `https://restcountries.com/v3.1/name/${country}`;
  const guardianURL = `https://content.guardianapis.com/search?section=world&q=${noWhitespace}&api-key=b2cce45c-d598-4746-9bb0-676b8ea3b67d`;
  console.log(guardianURL);
  fetch(countryUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const infoObj = {
        country: data[0].name.common,
        capital: data[0].capital,
        population: data[0].population,
        flag: data[0].flags.png,
        latitude: data[0].capitalInfo.latlng[0],
        longitude: data[0].capitalInfo.latlng[1],
      };
      console.log(data);
      showFacts(infoObj);
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
});
