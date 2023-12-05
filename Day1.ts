import * as fs from 'fs';
const lines = fs.readFileSync('./inputs/day1.txt', 'utf-8').split("\r\n");

let total = 0;
lines.forEach(line => total += getValue(line))
console.log(total);

function getValue(line: string): number {
	line = convertLine(line);
	let firstDigit: number | undefined, lastDigit: number | undefined;
	line.split('').forEach(char => {
		let converted = parseInt(char);
		if(Number.isNaN(converted)) return 0;
		if(!firstDigit) firstDigit = converted;
		lastDigit = converted;
	})
	if(firstDigit && lastDigit) return parseInt("" + firstDigit + lastDigit);
	return 0
}

function convertLine(line: string): string {
	const regex = /(?=(zero|one|two|three|four|five|six|seven|eight|nine|ten))/mg;
	return line.replace(regex, (_, p1) => {
		return ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"].indexOf(p1).toString();
	});
}
