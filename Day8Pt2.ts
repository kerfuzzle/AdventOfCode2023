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

function gcd(a: number, b: number): number {
	if(b === 0) return a;
	return gcd(b, a % b);
}

function lcm(array: number[]): number {
	let result = array[0];
	for(let i = 1; i < array.length; i++){
		result = (result * array[i]) / gcd(result, array[i])
	}
	return result;
}

const locations = new Map<string, Location>();
const directions = lines[0].split('');
lines = lines.slice(2);
let startLocations: Location[] = []; 

lines.forEach(line => {
	const componentArray = line.split('=');
	const currentLocation = componentArray[0].replace(' ', '');
	const options = componentArray[1].replace(/\(|\)|\s/gm ,'').split(',');
	if(locations.get(currentLocation)) console.log('already exists')
	const location = new Location(options[0], options[1], currentLocation)
	locations.set(currentLocation, location);
	if(currentLocation.slice(-1) == 'A') startLocations.push(location)
})

let counts: number[] = []
startLocations.forEach(startLocation => {
	let currentLocation = startLocation;
	let count = 0, directionIndex = 0;
	while(currentLocation.self.slice(-1) !== 'Z') {		
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
	counts.push(count);
})

console.log(lcm(counts))
