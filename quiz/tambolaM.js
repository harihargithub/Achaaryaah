// tambolaM.js

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

function addPlayer() {
  playerCount++;
  const playerTicket = generateRandomTicket();
  players.push({ id: playerCount, ticket: playerTicket, punched: [] });

  // Save the player's ticket to localStorage
  localStorage.setItem(
    `playerTicket-${playerCount}`,
    JSON.stringify(playerTicket),
  );

  // Create player element and display the ticket
  const playerDiv = document.createElement('div');
  playerDiv.classList.add('player-container');
  playerDiv.id = `player-${playerCount}`;
  playerDiv.innerHTML = `
        <h3>Player ${playerCount}</h3>
        <div id="ticket-${playerCount}" class="ticket"></div>
        <p>Share this link with Player ${playerCount}: 
           <a href="https://madhwa.abjaja.in/quiz/tambolaP.html?playerId=${playerCount}" target="_blank">
             Player ${playerCount} Ticket
           </a>
        </p>
        <button onclick="checkWin(${playerCount})">Check Win</button>
    `;

  const ticketDiv = playerDiv.querySelector(`#ticket-${playerCount}`);
  playerTicket.forEach((num) => {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.textContent = num || ''; // Empty cell for empty string
    ticketDiv.appendChild(div);
  });

  document.getElementById('players').appendChild(playerDiv);
}
// Generate a random ticket
function generateRandomTicket() {
  const ticket = Array.from({ length: 27 }, () => ''); // 3 rows, 9 columns, total 27 cells
  const selectedNumbers = new Set(); // A Set to avoid duplicate numbers

  // Generate exactly 15 unique numbers for the ticket
  while (selectedNumbers.size < 15) {
    const randomNumber =
      totalNumbers[Math.floor(Math.random() * totalNumbers.length)];
    selectedNumbers.add(randomNumber); // Add unique numbers to the set
  }

  // Convert the Set to an array of numbers
  const numbers = Array.from(selectedNumbers);

  // Distribute the 15 numbers into the ticket, leaving the rest as empty strings
  let count = 0;
  while (count < 15) {
    const index = Math.floor(Math.random() * ticket.length); // Randomly select an empty cell
    if (ticket[index] === '') {
      // Ensure the cell is empty
      ticket[index] = numbers[count]; // Place the number in the ticket
      count++;
    }
  }

  // Ensure all remaining cells are empty strings
  for (let i = 0; i < ticket.length; i++) {
    if (ticket[i] === null) {
      ticket[i] = '';
    }
  }

  // Debugging: Log the generated ticket to verify
  console.log('Generated Ticket for Player: ', ticket);

  return ticket;
} // Call a random number
function callNumber() {
  if (remainingNumbers.length === 0) {
    alert('All numbers have been called!');
    return;
  }

  const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
  const calledNumber = remainingNumbers.splice(randomIndex, 1)[0];
  document.getElementById('called-number').textContent = calledNumber;

  // Retrieve the existing called numbers or initialize to an empty array
  let calledNumbers = JSON.parse(localStorage.getItem('calledNumbers')) || [];

  // Add the new called number to the list
  calledNumbers.push(calledNumber);

  // Save the updated called numbers back to localStorage
  localStorage.setItem('calledNumbers', JSON.stringify(calledNumbers));

  // Debugging: Log the called numbers to verify
  console.log('Called Numbers: ', calledNumbers); // Log called numbers for debugging

  // Highlight the called number on the board
  const numberElement = document.getElementById(`number-${calledNumber}`);
  if (numberElement) numberElement.classList.add('called');
}

// Punch a number on the ticket
function punchNumber(playerId, num, cell) {
  const calledNumbers = JSON.parse(localStorage.getItem('calledNumbers')) || [];
  if (num && calledNumbers.includes(num)) {
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

// Retrieve ticket for player view (used in player-specific HTML)
function loadPlayerTicket(playerId) {
  const ticket = JSON.parse(localStorage.getItem(`playerTicket-${playerId}`));
  if (!ticket) {
    alert('Ticket not found for this player. Please contact the manager.');
    return;
  }

  const ticketDiv = document.getElementById('ticket');
  ticket.forEach((num) => {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.textContent = num || '';
    div.onclick = () => punchNumber(playerId, num, div);
    ticketDiv.appendChild(div);
  });
}
