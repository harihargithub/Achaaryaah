//  **JavaScript (tambola1.js)**

const totalNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
let remainingNumbers = [...totalNumbers];

// Generate number board
const board = document.getElementById('number-board');
totalNumbers.forEach((num) => {
  const div = document.createElement('div');
  div.classList.add('number');
  div.textContent = num;
  div.id = `number-${num}`;
  board.appendChild(div);
});

// Generate player ticket
const playerTicket = document.getElementById('player-ticket');
const ticketNumbers = generateRandomTicket();
ticketNumbers.forEach((num) => {
  const div = document.createElement('div');
  div.classList.add('cell');
  div.textContent = num || ''; // Empty cell for 0
  if (num) div.setAttribute('id', `ticket-${num}`);
  div.onclick = () => punchNumber(div, num);
  playerTicket.appendChild(div);
});

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
function punchNumber(cell, num) {
  if (num && remainingNumbers.indexOf(num) === -1) {
    cell.classList.add('punched');
  } else {
    alert('This number has not been called yet!');
  }
}
