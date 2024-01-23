'use strict';

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
	constructor(height = 6, width = 7, players) {
		this.height = height;
		this.width = width;
		this.players = players;
		this.currPlayer = this.players[0];
		this.board = [];

		this.boundHandleClick = this.handleClick.bind(this);
		this.resetPlayers(this.players);
		this.makeBoard();
		this.makeHtmlBoard();
	}

	/**
	 * makeBoard: create in-JS board structure:
	 * board = array of rows, each row is array of cells  (board[y][x])
	 *
	 */

	// displays the rows and columns as an empty array(if was added a piece replaces null with the index )
	makeBoard() {
		for (let y = 0; y < this.height; y++) {
			const row = [];
			for (let x = 0; x < this.width; x++) {
				row.push(null);
			}
			this.board.push(row);
		}
	}

	/**
	 * makeHtmlBoard: make HTML table and row of column tops.
	 * */

	makeHtmlBoard() {
		console.log('makeHtmlBoard called');
		const htmlBoard = document.getElementById('board');
		htmlBoard.innerHTML = '';

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement('tr');
		top.setAttribute('id', 'column-top');
		top.addEventListener('click', this.boundHandleClick);

		for (let x = 0; x < this.width; x++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			top.append(headCell);
		}

		htmlBoard.append(top);

		// make main part of board
		for (let y = 0; y < this.height; y++) {
			const row = document.createElement('tr');

			for (let x = 0; x < this.width; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `c-${y}-${x}`);
				row.append(cell);
			}

			htmlBoard.append(row);
		}
	}

	/** findSpotForCol: given column x, return top empty y (null if filled) */

	findSpotForCol(x) {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	/** placeInTable: update DOM to place piece into HTML table of board */

	placeInTable(y, x) {
		const piece = document.createElement('div');
		piece.classList.add('piece');
		piece.classList.add(`p${this.currPlayer.number}`);
		piece.style.backgroundColor = this.currPlayer.color;

		const spot = document.getElementById(`c-${y}-${x}`);
		console.log('spot', spot);
		console.log('x', x);
		console.log('y', y);
		console.log('board', this.board);
		spot.append(piece);
	}

	/** endGame: announce game end */

	endGame(msg) {
		if (msg !== 'Tie!') {
			const winFlag = document.getElementById(`p${this.currPlayer.number}-win`);
			winFlag.style.display = 'inline';
		}
		// inserting the message into the <p> tag
		const outcomeMessage = document.getElementById('outcome-message');
		outcomeMessage.innerText = msg;

		console.log('removing event listener from this: ', this);

		//removing handler in order to disable game logic
		const top = document.getElementById('column-top');
		top.removeEventListener('click', this.boundHandleClick);
	}

	/**
	 * Reset the appearance of the players on the game board (win flags and
	 * player names)
	 */

	resetPlayers(players) {
		document.getElementById('player1-settings-title').innerText =
			players[0].name;
		document.getElementById('player2-settings-title').innerText =
			players[1].name;

		document.getElementById('p1-win').style.display = 'none';
		document.getElementById('p2-win').style.display = 'none';
	}

	/** handleClick: handle click of column top to play piece */

	handleClick(evt) {
		console.log('handleClick', 'evt: ', evt);
		// get x from ID of clicked cell
		const x = +evt.target.id;

		// get next spot in column (if none, ignore click)
		console.log('this: ', this);
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}

		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer.number;
		this.placeInTable(y, x);

		console.log('about to checkForWin');
		// check for win
		if (this.checkForWin()) {
			return this.endGame(`${this.currPlayer.name} won!`);
		}
		//
		// check for tie ,
		// first "every" iterates over each row of the board.
		//second "every" iterates over each cell in that row.
		// The condition cell => cell checks if each cell in the row has a truthy value.
		//  If all cells in all rows have truthy values (meaning they are not null, undefined, or falsy),
		//  then "every" returns true. This means that "every" cell in "every" row is filled.
		if (this.board.every((row) => row.every((cell) => cell))) {
			return this.endGame('Tie!');
		}

		// switch players
		this.currPlayer =
			this.currPlayer.number === 1 ? this.players[1] : this.players[0];
	}

	/** checkForWin: check board cell-by-cell for "does a win start here?" */

	checkForWin() {
		function _win(cells) {
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match currPlayer

			return cells.every(
				([y, x]) =>
					y >= 0 &&
					y < this.height &&
					x >= 0 &&
					x < this.width &&
					this.board[y][x] === this.currPlayer.number
			);
		}
		console.log('this', this);

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				// get "check list" of 4 cells (starting here) for each way to win
				const horiz = [
					[y, x],
					[y, x + 1],
					[y, x + 2],
					[y, x + 3],
				];
				const vert = [
					[y, x],
					[y + 1, x],
					[y + 2, x],
					[y + 3, x],
				];
				const diagDR = [
					[y, x],
					[y + 1, x + 1],
					[y + 2, x + 2],
					[y + 3, x + 3],
				];
				const diagDL = [
					[y, x],
					[y + 1, x - 1],
					[y + 2, x - 2],
					[y + 3, x - 3],
				];

				// find winner (only checking each win-possibility as needed)
				//if (boundWin(horiz) || boundWin (vert) )
				if (
					_win.call(this, horiz) ||
					_win.call(this, vert) ||
					_win.call(this, diagDR) ||
					_win.call(this, diagDL)
				) {
					return true;
				}
			}
		}
	}
}

/* Attach Click Event to New Game Button ------------------------------------ */
const newGameButton = document.getElementById('start-game');
newGameButton.addEventListener('click', function (event) {
	event.preventDefault();

	let p1name = document.getElementById('player1-name');
	const p1color = document.getElementById('player1-color');
	console.log('p1name: ', p1name);
	console.log('p1color: ', p1color);

	let p2name = document.getElementById('player2-name');
	const p2color = document.getElementById('player2-color');
	console.log('p2name: ', p2name);
	console.log('p2color: ', p2color);

	if (!p1name.value) p1name = { value: 'P1' };
	if (!p2name.value) p2name = { value: 'P2' };

	console.log('p1name: ', p1name);
	console.log('p2name: ', p2name);

	const playerOne = new Player(p1name.value, p1color.value, 1);
	const playerTwo = new Player(p2name.value, p2color.value, 2);
	console.log('playerOne created: ', playerOne);
	console.log('playerTwo created: ', playerTwo);
	const newGame = new Game(6, 7, [playerOne, playerTwo]);
});
