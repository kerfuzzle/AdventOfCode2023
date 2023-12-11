import * as fs from 'fs';
let lines = fs.readFileSync('./inputs/day11.txt', 'utf-8').split("\r\n").map(line => line.split(''));
let expandedRows: number[] = []
let expandedColumns: number[] = []

for(let i = 0; i < lines.length; i++) {
	if(lines[i].every(character => character === '.')) {
		expandedRows.push(i);
	}
}
for(let i = 0; i < lines[0].length; i++) {
	const column = lines.map(row => row[i]);
	if(column.every(character => character === '.')) {
		expandedColumns.push(i)
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
lines.forEach((line, y) => {
	line.forEach((character, x) => {
		if(character == '#') {
			let newX = x;
			let newY = y;
			expandedRows.forEach(rowIndex => {
				if(y > rowIndex) newY += 999999
			})
			expandedColumns.forEach(columnIndex => {
				if(x > columnIndex) newX += 999999
			})
			galaxies.push(new Galaxy(newX, newY))
		}
	})
})

let total = 0
let pairs = 0
for(let i = 0; i < galaxies.length - 1; i++) {
	for(let j = i + 1; j < galaxies.length; j++) {
		total += Galaxy.getDistance(galaxies[i], galaxies[j])
		pairs++;
	}
}
console.log("Total: ", total, " Pairs: ", pairs)