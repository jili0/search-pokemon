const searchBtn = document.querySelector("#searchBtn");
const displayNamesBtn = document.querySelector("#displayNamesBtn");
const input = document.querySelector("input");
const container = document.querySelector("#container");

const handleClick = (e) => {
  e.preventDefault();
  const inputValue = input.value;
  if (!inputValue) {
    container.textContent = "Please enter a value";
    return;
  }
  container.textContent = `Searching Pokemon "${inputValue}"...`;
  container.style.display = "flex";

  fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue.toLowerCase()}/`)
    .then((res) => res.json())
    .then((data) => {
      const name =
        data.name.slice(0, 1).toUpperCase() + data.name.slice(1).toLowerCase();
      const img = data.sprites.front_default;
      const stats = data.stats.map((item) => [item.stat.name, item.base_stat]);
      const abilities = data.abilities.map((item) => item.ability.name);
      const html = `
      <p class="card-name">${name}</p>
      <img class="card-img" src="${img}" />
      <p class="card-stats-title">Stats</p>
      <div class="card-stats-container">
      ${stats
        .map(
          (item) =>
            "<div class='card-stats-item'><p>" +
            item[0] +
            "</p><p>" +
            item[1] +
            "</p></div>"
        )
        .join("")}
      </div>
      <p class="card-abilities-title">Abilities</p>
      <div class="card-abilities-container">
      ${abilities
        .map((item) => "<p class='card-abilities-item'>" + item + "</p>")
        .join("")}
      </div>
      `;
      container.textContent = "";
      container.innerHTML = html;
      console.log(html);
    })
    .catch((err) => {
      console.error(err);
      container.textContent = `Sorry, the name "${inputValue}" doesn't exist`;
      container.style.display = "flex";
    });
};

const displaySomeNames = (e) => {
  e.preventDefault();
  container.textContent = "Searching all pokemons... ";
  container.style.display = "flex";
  fetch("https://pokeapi.co/api/v2/pokemon/")
    .then((res) => res.json())
    .then((data) => {
      const names = data.results
        .map(
          (item) =>
            item.name.slice(0, 1).toUpperCase() +
            item.name.slice(1).toLowerCase()
        )
        .join(", ");
      container.textContent = names;
    })
    .catch((err) => {
      console.error(err);
      container.textContent = "Sorry, there is a problem displaying all names";
      container.style.display = "flex";
    });
};

searchBtn.addEventListener("click", handleClick);
displayNamesBtn.addEventListener("click", displaySomeNames);
