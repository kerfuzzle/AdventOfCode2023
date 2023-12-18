import * as fs from 'fs';
type Coordinate = { x: number, y: number }

class Digger {
	x: number = 0;
	y: number = 0;
	currentDistance: number = 0;
	points: Coordinate[] = [];
	constructor() {
		this.points.push({ x: this.x, y: this.y })
	}
	moveDigger(direction: string, distance: number) {
		if(direction === 'U') this.y += distance;
		if(direction === 'D') this.y -= distance;
		if(direction === 'L') this.x -= distance;
		if(direction === 'R') this.x += distance;
		if(!this.points.find(point => point.x === this.x && point.y === this.y)) this.points.push({ x: this.x, y: this.y })
	}
	getArea() {
		let interiorArea = 0;
		let perimeter = 0;
		for(let i = 0; i < this.points.length; i++) {
			const currentCoordinate = this.points[i];
			const nextCoordinate = this.points[i + 1 >= this.points.length ? 0 : i + 1]
			interiorArea += currentCoordinate.x * nextCoordinate.y - currentCoordinate.y * nextCoordinate.x;
			perimeter += Math.abs(nextCoordinate.x - currentCoordinate.x) + Math.abs(nextCoordinate.y - currentCoordinate.y)
		}
		return Math.abs(interiorArea/2) + perimeter / 2 + 1;
	}
}

let lines = fs.readFileSync('./inputs/day18.txt', 'utf-8').split("\r\n");
const diggerPt1 = new Digger();
const diggerPt2 = new Digger();
lines.forEach(line => {
	//Pt 1.
	let [direction, distance, colour] = line.split(' ');
	diggerPt1.moveDigger(direction, parseInt(distance))
	//Pt 2.
	colour = colour.replace(/\(|\)|#/g, '');
	let direction2 = ['R', 'D', 'L', 'U'][parseInt(colour.slice(-1))]
	let distance2 = parseInt('0x' + colour.slice(0, -1));
	diggerPt2.moveDigger(direction2, distance2);
})

console.log("Part 1:", diggerPt1.getArea())
console.log("Part 2:", diggerPt2.getArea())