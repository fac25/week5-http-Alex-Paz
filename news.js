const form = document.querySelector("form");
const output = document.querySelector("output");
const newsContainer = document.querySelector("#news");
let newsArr = [];
function showNews(countryName) {
  const news = countryName.response.results;

  news.forEach((element) => {
    let sectionName = element.sectionName;
    let webPublicationDate = element.webPublicationDate;
    let webTitle = element.webTitle;
    let webUrl = element.webUrl;

    let card = document.createElement("div");
    card.classList = "card";
    let cardContent = `
        <span>${sectionName}</span>
        <span>${webPublicationDate}</span>
        <h2><a href="${webUrl}">${webTitle}</a></h2>
       `;
    card.innerHTML = cardContent;
    newsContainer.appendChild(card);
  });
}
form.addEventListener("submit", (event) => {
  // stop the form submitting and reloading the page
  event.preventDefault();

  // clear out any previous results
  newsContainer.innerHTML = "";

  //`https://content.guardianapis.com/world/${name}?api-key=b2cce45c-d598-4746-9bb0-676b8ea3b67d`

  // get the value of the field with name="country"
  const formData = new FormData(form);
  const name = formData.get("country");
  console.log(
    `https://content.guardianapis.com/search?q=${name}&api-key=b2cce45c-d598-4746-9bb0-676b8ea3b67d`
  );
  fetch(
    `https://content.guardianapis.com/search?q=${name}&api-key=b2cce45c-d598-4746-9bb0-676b8ea3b67d`,
    {
      headers: {
        "Access-Control-Allow-Origin": "no-cors",
      },
    }
  )
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    // if we get a successful response
    .then((countryData) => {
      showNews(countryData);
    })
    // if the request is unsuccessful
    .catch((error) => {
      console.log(error);
      if (error.message === "404") {
        output.textContent = `⚠️ Couldn't find "${name}"`;
      } else {
        output.textContent = "⚠️ Something went wrong";
      }
    });
});
