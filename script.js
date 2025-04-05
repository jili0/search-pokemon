const searchBtn = document.querySelector("#searchBtn");
const displayNamesBtn = document.querySelector("#displayNamesBtn");
const input = document.querySelector("input");
const container = document.querySelector("#container");
const appWrapper = document.querySelector(".app-wrapper");

const handleClick = (e) => {
  e.preventDefault();
  const inputValue = input.value;
  
  if (!inputValue) {
    // Keep the centered layout for error messages
    appWrapper.classList.remove("search-active");
    container.innerHTML = "<div class='error-message'>Please enter a value</div>";
    container.style.display = "flex";
    return;
  }
  
  // First show loading message in the centered layout
  appWrapper.classList.remove("search-active");
  container.innerHTML = `<div class='error-message'>Searching Pokemon "${inputValue}"...</div>`;
  container.style.display = "flex";

  fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue.toLowerCase()}/`)
    .then((res) => res.json())
    .then((data) => {
      // When we get valid data, switch to two-column layout
      appWrapper.classList.add("search-active");
      
      const name =
        data.name.slice(0, 1).toUpperCase() + data.name.slice(1).toLowerCase();
      const img = data.sprites.front_default;
      const stats = data.stats.map((item) => [item.stat.name, item.base_stat]);
      const abilities = data.abilities.map((item) => item.ability.name);
      
      // Ensure we have 6 ability slots (same as stats)
      const totalSlots = 6;
      let abilitiesHtml = '';
      
      // Add actual abilities
      for (let i = 0; i < abilities.length; i++) {
        abilitiesHtml += `<div class='card-abilities-item'>${abilities[i]}</div>`;
      }
      
      // Add empty slots to match stats count
      for (let i = abilities.length; i < totalSlots; i++) {
        abilitiesHtml += `<div class='card-abilities-item'>&nbsp;</div>`;
      }
      
      const html = `
      <p class="card-name">${name}</p>
      <img class="card-img" src="${img}" />
      
      <div class="pokemon-data">
        <div class="stats-section">
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
        </div>
        
        <div class="abilities-section">
          <p class="card-abilities-title">Abilities</p>
          <div class="card-abilities-container">
            ${abilitiesHtml}
          </div>
        </div>
      </div>
      `;
      container.innerHTML = html;
      container.style.display = "flex";
    })
    .catch((err) => {
      // Keep the centered layout for error messages
      appWrapper.classList.remove("search-active");
      console.error(err);
      container.innerHTML = `<div class='error-message'>Sorry, the name "${inputValue}" doesn't exist</div>`;
      container.style.display = "flex";
    });
};

const displaySomeNames = (e) => {
  e.preventDefault();
  
  // First show loading message in the centered layout
  appWrapper.classList.remove("search-active");
  container.innerHTML = "<div class='error-message'>Searching all pokemons...</div>";
  container.style.display = "flex";
  
  fetch("https://pokeapi.co/api/v2/pokemon/")
    .then((res) => res.json())
    .then((data) => {
      // When we get valid data, switch to two-column layout
      appWrapper.classList.add("search-active");
      
      const namesHtml = data.results
        .map(
          (item) => {
            const name = item.name.slice(0, 1).toUpperCase() + item.name.slice(1).toLowerCase();
            return `<div class='card-abilities-item' onclick="searchPokemon('${item.name}')">${name}</div>`;
          }
        )
        .join("");
        
      container.innerHTML = `
        <p class="card-name">Available Pokemon</p>
        <div class="names-container">
          <div class="card-abilities-container">
            ${namesHtml}
          </div>
        </div>
      `;
    })
    .catch((err) => {
      // Keep the centered layout for error messages
      appWrapper.classList.remove("search-active");
      console.error(err);
      container.innerHTML = "<div class='error-message'>Sorry, there is a problem displaying pokemon names</div>";
      container.style.display = "flex";
    });
};

// Helper function to make names clickable
function searchPokemon(name) {
  input.value = name;
  searchBtn.click();
}

// Reset to centered layout if user clears the search and hits escape
input.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && input.value === '') {
    appWrapper.classList.remove("search-active");
    container.style.display = "none";
  }
});

searchBtn.addEventListener("click", handleClick);
displayNamesBtn.addEventListener("click", displaySomeNames);