// NEWS CARDS
const newsContainer = document.querySelector("#news");
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
    newsContainer.appendChild(card);
  });
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
//const countryUrl = `https://restcountries.com/v3.1/name/spain`;
selectDrop.addEventListener("change", (e) => {
  // clear out any previous results
  newsContainer.innerHTML = "";

  let country = e.target.value;
  const countryUrl = `https://restcountries.com/v3.1/name/${country}`;
  const guardianURL = `https://content.guardianapis.com/search?q=${country}&api-key=b2cce45c-d598-4746-9bb0-676b8ea3b67d`;
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
      console.log(infoObj);
    })
    .then(
      fetch(guardianURL)
        .then((response) => {
          return response.json();
        })
        .then((countryNews) => {
          showNews(countryNews);
          //console.log(countryNews);
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
