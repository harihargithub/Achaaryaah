const totalNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
let remainingNumbers = [...totalNumbers];
let players = [];
let playerCount = 0;

// Generate the number board
const board = document.getElementById('number-board');
totalNumbers.forEach((num) => {
  const div = document.createElement('div');
  div.classList.add('number');
  div.textContent = num;
  div.id = `number-${num}`;
  board.appendChild(div);
});

// Add a new player
function addPlayer() {
  playerCount++;
  const playerTicket = generateRandomTicket();
  players.push({ id: playerCount, ticket: playerTicket, punched: [] });

  const playerDiv = document.createElement('div');
  playerDiv.classList.add('player-container');
  playerDiv.id = `player-${playerCount}`;
  playerDiv.innerHTML = `
        <h3>Player ${playerCount}</h3>
        <div id="ticket-${playerCount}" class="ticket"></div>
        <button onclick="checkWin(${playerCount})">Check Win</button>
    `;

  const ticketDiv = playerDiv.querySelector(`#ticket-${playerCount}`);
  playerTicket.forEach((num) => {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.textContent = num || ''; // Empty cell for null
    if (num) div.setAttribute('id', `ticket-${playerCount}-${num}`);
    div.onclick = () => punchNumber(playerCount, num, div);
    ticketDiv.appendChild(div);
  });

  document.getElementById('players').appendChild(playerDiv);
}

// Generate a random ticket
function generateRandomTicket() {
  const ticket = Array.from({ length: 9 * 3 }, () => null);
  for (let i = 0; i < 15; i++) {
    let index;
    do {
      index = Math.floor(Math.random() * ticket.length);
    } while (ticket[index] !== null);
    ticket[index] =
      totalNumbers[Math.floor(Math.random() * totalNumbers.length)];
  }
  return ticket;
}

// Call a random number
function callNumber() {
  if (remainingNumbers.length === 0) {
    alert('All numbers have been called!');
    return;
  }
  const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
  const calledNumber = remainingNumbers.splice(randomIndex, 1)[0];
  document.getElementById('called-number').textContent = calledNumber;

  // Highlight the called number
  const numberElement = document.getElementById(`number-${calledNumber}`);
  if (numberElement) numberElement.classList.add('called');
}

// Punch a number on the ticket
function punchNumber(playerId, num, cell) {
  if (num && remainingNumbers.indexOf(num) === -1) {
    cell.classList.add('punched');
    players.find((player) => player.id === playerId).punched.push(num);
  } else {
    alert('This number has not been called yet!');
  }
}

// Check for winning patterns
function checkWin(playerId) {
  const player = players.find((player) => player.id === playerId);
  const { ticket, punched } = player;

  // Check full house
  if (punched.length === 15) {
    document.getElementById(
      'winner-message',
    ).textContent = `Player ${playerId} wins with a Full House!`;
    return;
  }

  // Check rows
  for (let i = 0; i < 3; i++) {
    const row = ticket.slice(i * 9, (i + 1) * 9).filter((n) => n !== null);
    if (row.every((num) => punched.includes(num))) {
      document.getElementById(
        'winner-message',
      ).textContent = `Player ${playerId} wins with Row ${i + 1}!`;
      return;
    }
  }

  // Check corners
  const corners = [ticket[0], ticket[8], ticket[18], ticket[26]];
  if (corners.every((num) => punched.includes(num))) {
    document.getElementById(
      'winner-message',
    ).textContent = `Player ${playerId} wins with Corners!`;
    return;
  }

  alert(`Player ${playerId} has not won yet. Keep playing!`);
}
