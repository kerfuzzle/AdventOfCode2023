import * as fs from 'fs';
let lines = fs.readFileSync('./inputs/day8.txt', 'utf-8').split("\r\n");

class Location {
	left: string;
	right: string;
	self: string;
	constructor(left: string, right: string, self: string) {
		this.left = left, this.right = right, this.self = self;
	}
}

const locations = new Map<string, Location>();
const directions = lines[0].split('');
lines = lines.slice(2);

lines.forEach(line => {
	const componentArray = line.split('=');
	const currentLocation = componentArray[0].replace(' ', '');
	const options = componentArray[1].replace(/\(|\)|\s/gm ,'').split(',');
	if(locations.get(currentLocation)) console.log('already exists')
	const location = new Location(options[0], options[1], currentLocation)
	locations.set(currentLocation, location);
})

let currentLocation = locations.get('AAA');
if(currentLocation) {
	let count = 0, directionIndex = 0;
	while(currentLocation.self !== 'ZZZ') {		
		if(directionIndex >= directions.length) directionIndex = 0;
		const direction = directions[directionIndex];
		let newLocation: Location | undefined;
		if(direction == 'R') newLocation = locations.get(currentLocation?.right)
		if(direction == 'L') newLocation = locations.get(currentLocation?.left)
		if(!newLocation) console.log('not found')
		else currentLocation = newLocation;
		count++;
		directionIndex++
	}
	
	console.log(count);
} else console.log('Start not found');
