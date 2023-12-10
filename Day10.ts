import * as fs from 'fs';
let lines = fs.readFileSync('./inputs/day10.txt', 'utf-8').split("\r\n");

class Tile {
	up: boolean = false;
	down: boolean = false;
	left: boolean = false;
	right: boolean = false;
	start: boolean = false;
	distance: number | undefined;
	character: string;
	location: { x: number, y: number };
	constructor(character: string, x: number, y: number) {
		this.character = character;
		this.location = { x: x, y: y }
		switch (character) {
			case '|':
				this.up = this.down = true;
				break;
			case '-':
				this.left = this.right = true;
				break;
			case 'F':
				this.down = this.right = true;
				break;
			case '7':
				this.down = this.left = true;
				break;
			case 'J':
				this.up = this.left = true;
				break;
			case 'L':
				this.up = this.right = true;
				break;
			case 'S':
				this.start = this.up = this.down = this.left = this.right = true;
				break;
		}
	}

	getConnectedTiles(grid: Tile[][]) {
		let result: Tile[] = [];
		if(this.location.x - 1 >= 0 && this.left && grid[this.location.y][this.location.x - 1]?.right) result.push(grid[this.location.y][this.location.x - 1])
		if(this.location.x + 1 < grid[0].length && this.right && grid[this.location.y][this.location.x + 1]?.left) result.push(grid[this.location.y][this.location.x + 1])
		if(this.location.y - 1 >= 0 && this.up && grid[this.location.y - 1][this.location.x]?.down) result.push(grid[this.location.y - 1][this.location.x])
		if(this.location.y + 1 < grid.length && this.down && grid[this.location.y + 1][this.location.x]?.up) result.push(grid[this.location.y + 1][this.location.x])
		return result;
	}

	isTileInLoop(loop: Tile[]) {
		return loop.find(loopTile => loopTile.location.x === this.location.x && loopTile.location.y === this.location.y) !== undefined
	}
}

const grid: Tile[][] = lines.map((line, y) => line.split('').map((character, x) => new Tile(character, x, y)))

const start = grid.find(line => line.find(tile => tile.start))?.find(tile => tile.start)
start.distance = 0;
let loop: Tile[] = [];
let distance = 1;
if(start) {
	loop.push(start)
	let currentTile: Tile | undefined = start.getConnectedTiles(grid)[0]
	let previousTile: Tile | undefined = start;
	while(currentTile?.character !== 'S') {
		if(currentTile) {
			loop.push(currentTile)
			currentTile.distance = distance;
			distance++;
			let newPrevious = currentTile;
			currentTile = currentTile.getConnectedTiles(grid).find(tile => !(tile.location.x == previousTile?.location.x && tile.location.y == previousTile?.location.y))
			previousTile = newPrevious;
		}
		else break;
	}
}

let includedTiles = []
grid.forEach(row => {
	let crossingCount = 0;
	row.forEach(tile => {
		let tileInLoop = tile.isTileInLoop(loop);
		if(tileInLoop) {
			let previousLoopTile = loop[tile.distance - 1]
			if(tile.distance == 0) previousLoopTile = loop[loop.length - 1]
			let nextLoopTile = loop[tile.distance + 1]
			if(tile.distance == loop.length - 1) nextLoopTile = loop[0]
			if(nextLoopTile.location.y > tile.location.y) {
				// console.log(previousLoopTile.character, tile.character, 'DOWN')
				crossingCount--; //DOWN
			}
			else if(previousLoopTile.location.y > tile.location.y) {
				// console.log(previousLoopTile.character, tile.character, 'UP')
				crossingCount++; //UP
			} // else console.log(previousLoopTile.character, tile.character, 'EVEN')
		} 
		else if(crossingCount !== 0) {
			includedTiles.push(tile)
		}
	})
})

console.log("Enclosed Cells: ", includedTiles.length, "\nFurthest Loop Distance: ", distance / 2, "\nVisualisation:")
grid.forEach(row => {
	console.log(row.map(tile => {
		if(tile.isTileInLoop(includedTiles)) return '\x1b[34m\x1b[5m#\x1b[0m'
		else if(tile.character == 'S') return '\x1b[41m\x1b[37mS\x1b[0m'
		else if(tile.isTileInLoop(loop)) return '\x1b[35m' + ['│', '─', '┌', '┐', '┘', '└', 'S'][['|', '-', 'F', '7', 'J', 'L', 'S'].indexOf(tile.character)] + '\x1b[0m'
		else return '\x1b[90m' + ['│', '─', '┌', '┐', '┘', '└', '.'][['|', '-', 'F', '7', 'J', 'L', '.'].indexOf(tile.character)] + '\x1b[0m'
	}).join(''))
})