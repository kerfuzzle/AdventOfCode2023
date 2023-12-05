import * as fs from 'fs';
const lines = fs.readFileSync('./inputs/day3.txt', 'utf-8').split("\r\n");

class AdjacentNumber {
	number: number;
	startIndex: number;
	endIndex: number;
	constructor(number: number, startIndex: number, endIndex: any) {
		this.number = number
		this.startIndex = startIndex
		this.endIndex = endIndex
	}
}

let total = 0;
lines.forEach((line, lineIndex) => {
	line.split('').forEach((char, charIndex) => {
		if(/[\%\@\$\+\*\/\=\-\&\#]/mg.test(char)) {
			let adjacentNumbers: AdjacentNumber[] = [];
			for(let i = Math.max(lineIndex - 1, 0); i <= Math.min(lines.length - 1, lineIndex + 1); i++) {
				for(let j = Math.max(charIndex - 1, 0); j <= Math.min(line.length - 1, charIndex + 1); j++){
					if(/\d/mg.test(lines[i][j])) {
						let numberString = lines[i][j]
						let k = 1;
						while(/\d/mg.test(lines[i][j - k])) {
							numberString = lines[i][j - k] + numberString;
							k++
						}
						let l = 1
						while(/\d/mg.test(lines[i][j + l])) {
							numberString = numberString + lines[i][j + l]
							l++
						}

						let foundNumber = parseInt(numberString);
						let start = j - k + 1
						let end = j + l -1
						if(!adjacentNumbers.some(number => number.startIndex == start && number.endIndex == end && number.number == foundNumber)) {
							adjacentNumbers.push(new AdjacentNumber(foundNumber, start, end))
						}
					}
				}
			}
			if(adjacentNumbers.length == 2) {
				total += adjacentNumbers[0].number * adjacentNumbers[1].number;
			}
		}
	})
})
console.log(total);