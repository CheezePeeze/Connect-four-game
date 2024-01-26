const newGameButton = document.getElementById("start-game");
newGameButton.addEventListener("click", function (event) {
	event.preventDefault();

	let p1name = document.getElementById("player1-name");
	const p1color = document.getElementById("player1-color");
	console.log("p1name: ", p1name);
	console.log("p1color: ", p1color);

	let p2name = document.getElementById("player2-name");
	const p2color = document.getElementById("player2-color");
	console.log("p2name: ", p2name);
	console.log("p2color: ", p2color);

	if (!p1name.value) p1name = { value: "Player 1" };
	if (!p2name.value) p2name = { value: "Player 2" };

	console.log("p1name: ", p1name);
	console.log("p2name: ", p2name);

	const playerOne = new Player(p1name.value, p1color.value, 1);
	const playerTwo = new Player(p2name.value, p2color.value, 2);
	console.log("playerOne created: ", playerOne);
	console.log("playerTwo created: ", playerTwo);
	new Game(6, 7, [playerOne, playerTwo]);
});
