import * as fs from 'fs';
let lines = fs.readFileSync('./inputs/day16.txt', 'utf-8').split("\r\n");
let grid = lines.map(line => line.split(''));

enum Direction {
	UP, LEFT, DOWN, RIGHT
}

function traceBeam(x: number, y: number, direction: Direction, energisedTiles: Direction[][][]) {
	if(y >= grid.length || x >= grid[0].length || Math.min(x, y) < 0) return;
	if(energisedTiles[y][x].includes(direction)) return;
	energisedTiles[y][x].push(direction);
	//console.log(energisedTiles.map(row => row.map(arr => arr.length ? '#' : '.').join('')).join('\n'));
	switch (grid[y][x]) {
		case '.':
			if(direction === Direction.UP) traceBeam(x, y - 1, Direction.UP, energisedTiles);
			if(direction === Direction.RIGHT) traceBeam(x + 1, y, Direction.RIGHT, energisedTiles);
			if(direction === Direction.DOWN) traceBeam(x, y + 1, Direction.DOWN, energisedTiles);
			if(direction === Direction.LEFT) traceBeam(x - 1, y, Direction.LEFT, energisedTiles);
			break;
		case '|':
			if(direction !== Direction.UP) traceBeam(x, y + 1, Direction.DOWN, energisedTiles);
			if(direction !== Direction.DOWN) traceBeam(x, y - 1, Direction.UP, energisedTiles);
			break;
		case '-':
			if(direction !== Direction.LEFT) traceBeam(x + 1, y, Direction.RIGHT, energisedTiles);
			if(direction !== Direction.RIGHT) traceBeam(x - 1, y, Direction.LEFT, energisedTiles);
			break;
		case '/':
			if(direction === Direction.UP) traceBeam(x + 1, y, Direction.RIGHT, energisedTiles);
			if(direction === Direction.RIGHT) traceBeam(x, y - 1, Direction.UP, energisedTiles);
			if(direction === Direction.DOWN) traceBeam(x - 1, y, Direction.LEFT, energisedTiles);
			if(direction === Direction.LEFT) traceBeam(x, y + 1, Direction.DOWN, energisedTiles);
			break;
		case '\\':
			if(direction === Direction.UP) traceBeam(x - 1, y, Direction.LEFT, energisedTiles);
			if(direction === Direction.RIGHT) traceBeam(x, y + 1, Direction.DOWN, energisedTiles);
			if(direction === Direction.DOWN) traceBeam(x + 1, y, Direction.RIGHT, energisedTiles);
			if(direction === Direction.LEFT) traceBeam(x, y - 1, Direction.UP, energisedTiles);
			break;
	}
	return;
}

function getEnergisedCount(startX: number, startY: number, startDirection: Direction) {
	let energisedTiles: Direction[][][] = grid.map(row => row.map(x => []));
	traceBeam(startX, startY, startDirection, energisedTiles);
	let total = 0;
	energisedTiles.forEach(row => row.forEach(arr => {
		if(arr.length) total++;
	}))
	return total
}

console.log("Part 1: ", getEnergisedCount(0, 0, Direction.RIGHT));

let counts: number[] = [];
for(let i = 0; i < grid.length; i++) {
	counts.push(getEnergisedCount(0, i, Direction.RIGHT))
	counts.push(getEnergisedCount(grid[i].length - 1, i, Direction.LEFT))
}
for(let j = 0; j < grid[0].length; j++) {
	counts.push(getEnergisedCount(j, 0, Direction.DOWN))
	counts.push(getEnergisedCount(j, grid.length - 1, Direction.UP))
}

console.log("Part 2: ", Math.max.apply(0, counts))