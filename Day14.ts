import * as fs from 'fs';
let grid = fs.readFileSync('./inputs/day14.txt', 'utf-8').split("\r\n").map(line => line.split(''));

function tiltGrid(grid: string[][], direction: number) {
	if(direction == 0 || direction == 2) {
		for(let rowIndex = (direction == 0 ? 0 : grid.length - 1); (direction == 0 ? rowIndex < grid.length : rowIndex >= 0); (direction == 0 ? rowIndex++ : rowIndex--)) {
			for(let columnIndex = 0; columnIndex < grid[rowIndex].length; columnIndex++) {
				if(grid[rowIndex][columnIndex] === 'O') {
					grid[rowIndex][columnIndex] = '.'
					for(let i = (direction == 0 ? rowIndex - 1 : rowIndex + 1); (direction == 0 ? i >= -1 : i <= grid.length); (direction == 0 ? i-- : i++)) {
						if(i < 0 || i >= grid.length || grid[i][columnIndex] === '#' || grid[i][columnIndex] === 'O'){
							grid[(direction == 0 ? i + 1 : i - 1)][columnIndex] = 'O'
							break;
						} 
					}
				}
			}
		}
	} else if (direction == 1 || direction == 3) {
		for(let columnIndex = (direction == 1 ? 0 : grid[0].length - 1); (direction == 1 ? columnIndex < grid[0].length : columnIndex >= 0); (direction == 1 ? columnIndex++ : columnIndex--)) {
			for(let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
				if(grid[rowIndex][columnIndex] === 'O') {
					grid[rowIndex][columnIndex] = '.'
					for(let i = (direction == 1 ? columnIndex - 1 : columnIndex + 1); (direction == 1 ? i >= -1 : i <= grid.length); (direction == 1 ? i-- : i++)) {
						if(i < 0 || i >= grid.length || grid[rowIndex][i] === '#' || grid[rowIndex][i] === 'O'){
							grid[rowIndex][(direction == 1 ? i + 1 : i - 1)] = 'O'
							break;
						}
					}
				}
			}
		}
	}
	return grid
}

function calculateLoad(grid: string[][]) {
	let load = 0;
	grid.forEach((row, rowIndex) => row.forEach(char => {
		if(char === 'O') load += grid.length - rowIndex;
	}))
	return load
}

const previousGrids = new Map<string, number>()
let previousGrid: string[][];
let loopLength = 0;
let loopStart = 0;
for(let i = 0; i < 1000000000; i++) {
	for(let j = 0; j < 4; j++) {
		grid = tiltGrid(grid, j); 
	}
	if(previousGrids.has(JSON.stringify(grid))) {
		loopStart = previousGrids.get(JSON.stringify(grid));
		loopLength = (i + 1) - loopStart
		grid = previousGrid
		break;
	} else {
		previousGrids.set(JSON.stringify(grid), i + 1)
	}
	previousGrid = grid
}

let remaining = (1_000_000_000 - loopStart) % loopLength 
for(let i = 0; i < remaining; i++) {
	for(let j = 0; j < 4; j++) {
		grid = tiltGrid(grid, j); 
	}
}
console.log(grid.map(row => row.join('')).join('\n'))
console.log(calculateLoad(grid))