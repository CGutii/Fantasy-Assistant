const search = document.getElementById("search");
const results = document.getElementById("results");

let players = [];
let previousQuery = "";

async function fetchPlayersData() {
  const proxyUrl = "https://api.allorigins.win/raw?url=";
  const apiUrl = "https://fantasy.premierleague.com/api/bootstrap-static/";
  const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
  const data = await response.json();
  const positionMap = {
    1: "GK",
    2: "DEF",
    3: "MID",
    4: "FWD",
  };
  players = data.elements.map((player) => {
    return {
      id: player.id,
      firstName: player.first_name,
      lastName: player.second_name,
      team: data.teams.find((team) => team.id === player.team).short_name,
      pos: positionMap[player.element_type],
      points: player.total_points,
      owned: player.selected_by_percent,
    };
  });
}

function filterPlayers(query) {
  return players
    .filter((player) => {
      const searchName = `${player.firstName} ${player.lastName}`
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .toLowerCase();
      return searchName.includes(query.toLowerCase());
    })
    .sort((a, b) => b.points - a.points);
}

async function showPlayerDetails(player) {
  // Clear the results container
  results.innerHTML = "";

  // Create a container for the player details
  const playerDetailsContainer = document.createElement("div");
  playerDetailsContainer.classList.add("player-details");

  // Add player name
  const playerNameElement = document.createElement("h2");
  playerNameElement.textContent = `${player.firstName} ${player.lastName}`;
  playerDetailsContainer.appendChild(playerNameElement);

  // Add player image
  const playerImage = document.createElement("img");
  playerImage.src = playerPhoto;
  playerImage.alt = `${player.firstName} ${player.lastName}`;
  playerImage.width = 110;
  playerImage.height = 140;

  playerImage.addEventListener("error", (e) => {
    console.error("Error loading player image:", e);
  });

  playerDetailsContainer.appendChild(playerImage);

  // Add more player details
  // For example: player.position, player.team, player.points, etc.
  // Customize this section based on the data you want to display.

  // Append the player details container to the results container
  results.appendChild(playerDetailsContainer);

  // Add a back button to return to the search results
  const backButton = document.createElement("button");
  backButton.textContent = "Back";
  backButton.classList.add("back-button");
  backButton.addEventListener("click", () => {
    displayPlayers(filterPlayers(previousQuery));
  });

  results.appendChild(backButton);
}

function displayPlayers(filteredPlayers) {
  results.innerHTML = "";

  if (filteredPlayers.length > 0) {
    const headerRow = document.createElement("div");
    headerRow.classList.add("player-row", "header-row");
    headerRow.innerHTML = `
        <span>Name</span>
        <span>Team</span>
        <span>POS</span
        <span>Points</span>
        <span>Owned</span>
      `;
    results.appendChild(headerRow);
  }

  filteredPlayers.forEach((player) => {
    const playerRow = document.createElement("div");
    playerRow.classList.add("player-row");
    playerRow.innerHTML = `
        <span title="${player.firstName} ${
      player.lastName
    }">${player.firstName.charAt(0)}. ${player.lastName}</span>
        <span title="${player.team}">${player.team}</span>
        <span>${player.pos}</span>
        <span>${player.points} Pts</span>
        <span>${player.owned} %</span>
      `;

    playerRow.addEventListener("click", () => {
      showPlayerDetails(player);
    });

    results.appendChild(playerRow);
  });
}

search.addEventListener("input", (e) => {
  const query = e.target.value;
  previousQuery = query;
  const filteredPlayers = filterPlayers(query);
  displayPlayers(filteredPlayers);
});

search.addEventListener("focus", () => {
  if (previousQuery) {
    const filteredPlayers = filterPlayers(previousQuery);
    displayPlayers(filteredPlayers);
  }
});

// Fetch player data
fetchPlayersData();
