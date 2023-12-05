import * as fs from 'fs';
const lines = fs.readFileSync('./inputs/day2.txt', 'utf-8').split("\r\n");

class Game {
	turns: Turn[] = [];
	id: number = 0;
}

class Turn {
	red = 0;
	blue = 0;
	green = 0;
}

const games: Game[] = []

lines.forEach(line => {
	console.log(line);
	let rawLine = line.split(': ')[1];
	let id = parseInt(line.split(': ')[0].split(' ')[1]);
	let rawGame = rawLine.split("; ");
	let currentGame = new Game();
	currentGame.id = id;
	rawGame.forEach(gameElement => {
		let gameComponents = gameElement.split(' ');
		let currentTurn = new Turn();
		for(let i = 0; i < gameComponents.length; i += 2) {
			switch(gameComponents[i + 1].replace(',', '')){
				case 'blue':
					currentTurn.blue = parseInt(gameComponents[i])
					break;
				case 'red':
					currentTurn.red = parseInt(gameComponents[i])
					break;
				case 'green':
					currentTurn.green = parseInt(gameComponents[i])
					break;
			}
		}
		currentGame.turns.push(currentTurn);
	})
	games.push(currentGame);
})

let idTotal = 0;
games.forEach(game => {
	let validGame = true;
	let maxRed = 0, maxBlue = 0, maxGreen = 0;
	game.turns.forEach(turn => {
		// Pt. 2
		if(turn.red > maxRed) maxRed = turn.red;
		if(turn.blue > maxBlue) maxBlue = turn.blue;
		if(turn.green > maxGreen) maxGreen = turn.green;
		// if(turn.red > 12 || turn.blue > 14 || turn.green > 13) validGame = false; // Pt.1 
	})
	let power = maxRed * maxBlue * maxGreen;
	if(validGame) idTotal += power;
})
console.log(idTotal);
