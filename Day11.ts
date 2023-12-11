import * as fs from 'fs';
let lines = fs.readFileSync('./inputs/day11.txt', 'utf-8').split("\r\n");
let expanded: String[][] = []
lines.map(line => line.split('')).forEach((line, index) => {
	expanded.push(line)
	if(line.every(character => character == '.')) {
		expanded.push(new Array(line.length).fill('.'))
	}
})
for(let i = 0; i < expanded[0].length; i++) {
	const column = expanded.map(row => row[i]);
	if(column.every(character => character == '.')) {
		expanded.forEach((row, index) => {
			row.splice(i, 0, '.')
		})
		i++;
	}
}

class Galaxy {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x; this.y = y;
	}
	static getDistance(source: Galaxy, destination: Galaxy): number {
		let dx = destination.x - source.x;
		let dy = destination.y - source.y;
		return Math.abs(dx) + Math.abs(dy) // Manhattan Distance
	}
}
let galaxies: Galaxy[] = [];
expanded.forEach((line, y) => {
	line.forEach((character, x) => {
		if(character == '#') galaxies.push(new Galaxy(x, y))
	})
})
//console.log(expanded.map(line => line.join('')).join('\n'))
let total = 0
let pairs = 0
for(let i = 0; i < galaxies.length - 1; i++) {
	for(let j = i + 1; j < galaxies.length; j++) {
		total += Galaxy.getDistance(galaxies[i], galaxies[j])
		pairs ++;
	}
}
console.log("Total: ", total, " Pairs: ", pairs)