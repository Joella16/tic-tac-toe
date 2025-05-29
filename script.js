let board = [];
let currentPlayer = 'X';
let gameActive = true;
let mode = '2p';
let player1 = 'Player 1';
let player2 = 'Player 2';
let currentLevel = 1;

function createBoard() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  board = Array(9).fill('');
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    boardEl.appendChild(cell);
  }
}

function startGame() {
  currentPlayer = 'X';
  gameActive = true;
  mode = document.getElementById('mode').value;
  player1 = document.getElementById('player1').value || 'Player 1';
  player2 = document.getElementById('player2').value || (mode === '2p' ? 'Player 2' : 'Computer');

  document.getElementById('board').style.display = 'grid';
  document.getElementById('status').style.display = 'block';
  document.getElementById('restart').style.display = 'inline-block';
  document.getElementById('nextLevel').style.display = 'none';
  document.getElementById('levelComplete').style.display = 'none';
  document.getElementById('levelDisplay').textContent = `Level: ${currentLevel}`;

  createBoard();
  setStatus(`${player1}'s turn (X)`);
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index]) return;
  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add(currentPlayer.toLowerCase());
  document.getElementById('clickSound').play();

  if (checkWinner()) {
    gameActive = false;
    const winnerName = currentPlayer === 'X' ? player1 : player2;
    setStatus(`${winnerName} wins!`);
    document.getElementById('winSound').play();
    showStars();
    if (currentLevel < 10) {
      document.getElementById('levelComplete').textContent = `Level ${currentLevel} Complete!`;
      document.getElementById('levelComplete').style.display = 'block';
      document.getElementById('nextLevel').style.display = 'inline-block';
    }
  } else if (board.every(cell => cell)) {
    setStatus("It's a draw!");
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setStatus(`${currentPlayer === 'X' ? player1 : player2}'s turn (${currentPlayer})`);
    if (mode !== '2p' && currentPlayer === 'O') setTimeout(aiMove, 500);
  }
}

function aiMove() {
  let empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  const move = empty[Math.floor(Math.random() * empty.length)];
  document.querySelector(`.cell[data-index='${move}']`).click();
}

function checkWinner() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winPatterns.some(p => p.every(i => board[i] === currentPlayer));
}

function setStatus(msg) {
  document.getElementById('status').textContent = msg;
}

function showStars() {
  for (let i = 0; i < 15; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * window.innerWidth}px`;
    star.style.top = `${Math.random() * window.innerHeight}px`;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1000);
  }
}

function nextLevel() {
  currentLevel++;
  if (currentLevel <= 10) startGame();
  else alert('Congratulations! You completed all 10 levels!');
}
