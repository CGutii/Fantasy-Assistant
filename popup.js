const search = document.getElementById("search");
const results = document.getElementById("results");

let players = [];
let previousQuery = "";

async function fetchPlayers() {
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

  const teamNameMap = {
    ARS: "Arsenal",
    AVL: "Aston Villa",
    BRE: "Brentford",
    BHA: "Brighton & Hove Albion",
    BUR: "Burnley",
    CHE: "Chelsea",
    CRY: "Crystal Palace",
    EVE: "Everton",
    LEI: "Leicester City",
    LIV: "Liverpool",
    MCI: "Manchester City",
    MUN: "Manchester United",
    NEW: "Newcastle United",
    NOR: "Norwich City",
    SOU: "Southampton",
    TOT: "Tottenham Hotspur",
    WAT: "Watford",
    WHU: "West Ham United",
    WOL: "Wolverhampton Wanderers",
  };
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

function displayPlayers(filteredPlayers) {
  results.innerHTML = "";
  if (filteredPlayers.length > 0) {
    const headerRow = document.createElement("div");
    headerRow.classList.add("player-row", "header-row");
    headerRow.innerHTML = `
      <span>Name</span>
      <span>Team</span>
      <span>POS</span>
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
    results.appendChild(playerRow);
  });

  playerRow.innerHTML = `
  <span title="${player.firstName} ${
    player.lastName
  }">${player.firstName.charAt(0)}. ${player.lastName}</span>
  <span title="${player.teamFullName}">${player.team}</span>
  <span>${player.pos}</span>
  <span>${player.points} Pts</span>
  <span>${player.owned} %</span>
`;
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
fetchPlayers();
