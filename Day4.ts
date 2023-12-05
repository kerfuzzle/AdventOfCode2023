import * as fs from 'fs';
const lines = fs.readFileSync('./inputs/day4.txt', 'utf-8').split("\r\n");


console.time();
let total = 0
lines.forEach(line => {
	let cardWins = 0;
	let ourNumbers = line.split('|')[1].split(' ').map(number => number.replace(' ', '')).filter(number => number !== '').map(number => parseInt(number))
	let winningNunbers = line.split('|')[0].split(':')[1].split(' ').map(number => number.replace(' ', '')).filter(number => number !== '').map(number => parseInt(number))
	winningNunbers.forEach(winningNumber => {
		if(ourNumbers.includes(winningNumber)) cardWins++
	})
	if(cardWins) total += 2 ** (cardWins - 1);
})
console.log(total);
console.timeEnd();
