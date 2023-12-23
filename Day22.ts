import * as fs from 'fs';

class Cube {
	x: number; y: number; z: number;
	constructor(x: number, y: number, z: number) {
		this.x = x; this.y = y; this.z = z;
	}
}

class Brick {
	blocks: Cube[] = [];
	restingOn: Brick[] = [];
	name: string;
	minZ: number;
	maxZ: number = 0;
	constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, name: string) {
		this.name = name;
		this.minZ = z2;
		for(let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
			for(let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
				for(let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) {
					this.minZ = Math.min(this.minZ, z);
					this.maxZ = Math.max(this.maxZ, z)
					this.blocks.push(new Cube(x, y, z))
				}
			}
		}
	}

	moveDown() {
		this.maxZ--
		this.minZ--
		this.blocks.forEach(block => {
			block.z--;
		})
	}

	moveUp() {
		this.maxZ++
		this.minZ++
		this.blocks.forEach(block => {
			block.z++;
		})
	}

	static getChainReaction(brick: Brick, removedBricks = [brick]): number {
		let total = 0;
		bricks.filter(b => b.restingOn.includes(brick) && b.restingOn.filter(restingBrick => !removedBricks.includes(restingBrick)).length === 0).forEach(restingBrick => {
			removedBricks.push(restingBrick)
			total += 1 + this.getChainReaction(restingBrick, removedBricks);
		})
		return total;
	}

	static checkIntersection(a: Brick, b: Brick) { 
		return a.blocks.filter(aBlock => {
			return b.blocks.find(bBlock => aBlock.x === bBlock.x && aBlock.y === bBlock.y && aBlock.z === bBlock.z) !== undefined
		}).length > 0
	}
}

let lines = fs.readFileSync('./inputs/day22.txt', 'utf-8').split("\r\n");
let maxZ = 1;
const bricks = lines.map((line, index) => {
	const [c1, c2] = line.split('~').map(c => c.split(',').map(string => parseInt(string)));
	maxZ = Math.max(maxZ, c1[2], c2[2])
	return new Brick(c1[0], c1[1], c1[2], c2[0], c2[1], c2[2], String.fromCharCode(65 + index));
})

for(let i = 2; i <= maxZ; i++) {
	const zBricks = bricks.filter(brick => brick.minZ === i);
	zBricks.forEach(brick => {
		for(let j = i; j >= 2; j--) {
			brick.moveDown();
			const intersectingBricks = bricks.filter(b => b !== brick && Brick.checkIntersection(brick, b));
			if(intersectingBricks.length) {
				brick.restingOn = intersectingBricks;
				brick.moveUp();
				break;
			}
		}
	})
}

let count = 0;
let reactionSum = 0;
bricks.forEach(brick => {
	if(bricks.filter(b => b.restingOn.includes(brick) && b.restingOn.length === 1).length === 0) count++;
	//console.log(brick.name, "supporting", bricks.filter(b => b.restingOn.includes(brick)).map(b => b.name))
	const size = Brick.getChainReaction(brick)
	//console.log(brick.name, size)
	reactionSum += size
})
console.log("Part 1:", count);
console.log("Part 2:", reactionSum)