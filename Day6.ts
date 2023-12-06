import * as fs from 'fs';
const lines = fs.readFileSync('./inputs/day6.txt', 'utf-8').split("\r\n").map(line => line.split(' ').filter(line => line !== ''));
lines.forEach(line => line.shift())
class Race {
	time: number;
	recordDistance: number;
	constructor(time: number, recordDistance: number) {
		this.time = time;
		this.recordDistance = recordDistance;
	}
}

const races: Race[] = [];

/* Pt. 1
lines[0].forEach((time, index) => {
	races.push(new Race(parseInt(time), parseInt(lines[1][index])))
})
*/


// Pt. 2
let bigTime = parseInt(lines[0].join(''));
let bigDistance = parseInt(lines[1].join(''));
races.push(new Race(bigTime, bigDistance));
console.log(bigTime, bigDistance);


let total = 1;
races.forEach(race => {
	let combinations = 0;
	for(let i = 1; i < race.time + 1; i++) {
		let distance = i * (race.time - i);
		if(distance > race.recordDistance) combinations++;
	}
	total *= combinations;
})
console.log(total)