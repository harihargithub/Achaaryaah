// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBZAVFIJV9W_A4W7lh07Ikt2-oeNuMwJhQ",
  authDomain: "tambola-db7bb.firebaseapp.com",
  databaseURL: "https://tambola-db7bb-default-rtdb.firebaseio.com",
  projectId: "tambola-db7bb",
  storageBucket: "tambola-db7bb.firebasestorage.app",
  messagingSenderId: "689800248387",
  appId: "1:689800248387:web:68767bd47485bdf7d828f6"
};
if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// Simple login UI for manager
document.body.insertAdjacentHTML('afterbegin', `
  <div id="auth-container" style="padding:10px; background:#eee;">
    <input id="email" type="email" placeholder="Manager Email" />
    <input id="password" type="password" placeholder="Password" />
    <button id="login-btn">Login</button>
    <span id="auth-message" style="color:red"></span>
  </div>
`);

function initGame() {
  const totalNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
  let remainingNumbers = [...totalNumbers];
  let players = [];
  let playerCount = 0;

  // Fetch the current highest player ID from Firebase before allowing Add Player
  database.ref('playerTickets').once('value').then(snapshot => {
    const tickets = snapshot.val();
    if (tickets) {
      // Get the highest numeric key
      const ids = Object.keys(tickets).map(id => parseInt(id, 10));
      playerCount = Math.max(...ids);
    } else {
      playerCount = 0;
    }
  });
  let calledNumbers = [];
  let phrases = {};

  // Load phrases from JSON file
  fetch('phrases.json')
    .then((response) => response.json())
    .then((data) => {
      phrases = data;
    })
    .catch((error) => console.error('Error loading phrases:', error));

  // Generate the number board
  const board = document.getElementById('number-board');
  totalNumbers.forEach((num) => {
    const div = document.createElement('div');
    div.classList.add('number');
    div.textContent = num;
    div.id = `number-${num}`;
    board.appendChild(div);
  });

  // Clear called numbers and player tickets from Firebase when the page loads
  database.ref().set({
    calledNumbers: [],
    playerTickets: {},
  });

  // Function to add a player
  window.addPlayer = function addPlayer() {
    playerCount++;
    const playerTicket = generateRandomTicket();
    players.push({ id: playerCount, ticket: playerTicket, punched: [] });

    // Save the player's ticket to Firebase
    console.log(`Saving ticket for player ${playerCount}:`, playerTicket); // Debugging
    database.ref(`playerTickets/${playerCount}`).set({ ticket: playerTicket });

    // Create player element and display the ticket
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player-container');
    playerDiv.id = `player-${playerCount}`;
    playerDiv.innerHTML = `
          <h3>Player ${playerCount}</h3>
          <div id="ticket-${playerCount}" class="ticket"></div>
          <p>Share this link with Player ${playerCount}: 
             <a href="http://127.0.0.1:5501/quiz/tambolaP.html?playerId=${playerCount}" target="_blank">
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
  };

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
        ticket[index] = numbers[count]; // Place the number in the ticket
        count++;
      }
    }

    // Ensure all remaining cells are empty strings
    for (let i = 0; i < ticket.length; i++) {
      if (ticket[i] === null || ticket[i] === undefined) {
        ticket[i] = '';
      }
    }

    // Debugging: Log the generated ticket to verify
    console.log('Generated Ticket for Player: ', ticket);

    return ticket;
  }

  // Punch a number on the ticket
  window.punchNumber = function punchNumber(playerId, num, cell) {
    const calledNumbers = JSON.parse(localStorage.getItem('calledNumbers')) || [];
    if (num && calledNumbers.includes(num)) {
      cell.classList.add('punched');
      players.find((player) => player.id === playerId).punched.push(num);
    } else {
      alert('This number has not been called yet!');
    }
  };

  // Check for winning patterns
  window.checkWin = function checkWin(playerId) {
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
  };

  // Retrieve ticket for player view (used in player-specific HTML)
  window.loadPlayerTicket = function loadPlayerTicket(playerId) {
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
  };
}

// Only allow access to the game after successful login
document.getElementById('login-btn').onclick = function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('auth-container').style.display = 'none';
      initGame();
    })
    .catch((error) => {
      document.getElementById('auth-message').textContent = error.message;
    });
};