const symbols = ['%', '@', '$', '+', '*', '/', '=', '-', '&'];

import * as fs from 'fs';
const lines = fs.readFileSync('./inputs/day3.txt', 'utf-8').split("\r\n");
let total = 0;
lines.forEach((line, lineIndex) => {
	console.log(line)
	let currentNumberString = '';
	line.split('').forEach((char, charIndex) => {
		if(/\d/mg.test(char)) currentNumberString += char;
		if ((currentNumberString !== '' && !/\d/mg.test(char))  || (/\d/mg.test(char) && charIndex == line.length - 1)) {
			let adjacentCharacters = '';
			for(let i = charIndex - currentNumberString.length - 1; i < charIndex + 1; i++) {
				let correctedIndex = i;
				if(i >= line.length) correctedIndex = line.length - 1
				else if(i < 0) correctedIndex = 0
				// console.log(lineIndex == 0 ? lineIndex : lineIndex - 1, lineIndex, lineIndex == lines.length - 1 ? lineIndex : lineIndex + 1)
				adjacentCharacters += lines[lineIndex == 0 ? lineIndex : lineIndex - 1][correctedIndex] + lines[lineIndex][correctedIndex] + lines[lineIndex == lines.length - 1 ? lineIndex : lineIndex + 1][correctedIndex]
			}
			if(/[\%\@\$\+\*\/\=\-\&\#]/mg.test(adjacentCharacters)) {
				total += parseInt(currentNumberString)
				//console.log(currentNumberString)
			} else {console.log(parseInt(currentNumberString))}
			currentNumberString = '';
			//console.log(adjacentCharacters);
		}
	})
})
console.log(total);