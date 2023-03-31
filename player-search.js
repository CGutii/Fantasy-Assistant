// Function to search for a Premier League player by name
async function searchPlayer(name) {
  const response = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/"
  );
  const data = await response.json();

  // Search for player by name
  const player = data.elements.find(
    (element) =>
      element.first_name.toLowerCase() === name.toLowerCase() ||
      element.second_name.toLowerCase() === name.toLowerCase()
  );

  if (player) {
    const playerName = `${player.first_name} ${player.second_name}`;
    const playerPhoto = `https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p${player.photo.replace(
      ".jpg",
      ".png"
    )}`;
    const playerFplPoints = player.total_points;

    // Display player info in popup
    const popup = document.createElement("div");
    popup.innerHTML = `
        <h2>${playerName}</h2>
        <img src="${playerPhoto}" alt="${playerName}">
        <p>FPL Points: ${playerFplPoints}</p>
      `;
    document.body.appendChild(popup);
  } else {
    console.log("Player not found");
  }
}

// Example usage
searchPlayer("Mohamed Salah");
