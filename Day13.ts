import * as fs from 'fs';
let patterns = fs.readFileSync('./inputs/day13.txt', 'utf-8').split(/\n\s*\n/).map(pattern => pattern.split('\r\n').map(line => line.replace(/\r?\n|\r/g, '')))

function replaceChar(string: string, index: number, replacement: string): string {
	let arr = string.split('');
	arr[index] = replacement
	return arr.join('');
}

function getLinesOfSymmetry(array: string[]) {
	let result = [];
	for(let i = 0.5; i < array.length - 1; i++) {
		let j = 0
		while(array[Math.floor(i) - j] === array[Math.ceil(i) + j]) {
			j++;
		}
		if(j > 0 && (Math.floor(i) - j + 1 == 0 || Math.ceil(i) + j - 1 == array.length - 1)) result.push(Math.ceil(i))
	}
	return result
}

function getAlternativeValue(pattern: string[], currentValue: number) {
	for(let i = 0; i < pattern.length; i++) {
		for(let j = 0; j < pattern[i].length; j++) {
			let copy = [...pattern]
			copy[i] = replaceChar(copy[i], j, (copy[i][j] === '.' ? '#' : '.'))
			let columns = []
			for(let i = 0; i < copy[0].length; i++) {
				columns.push(copy.map(row => row[i]).join(''))
			}

			let horizontalSymmetry = getLinesOfSymmetry(copy)
			let verticalSymmetry = getLinesOfSymmetry(columns)
			let alternativeHorizontal = horizontalSymmetry.filter(x => x * 100 !== currentValue)
			let alternativeVertical = verticalSymmetry.filter(x => x !== currentValue)
			if(alternativeHorizontal.length) return alternativeHorizontal[0] * 100
			if(alternativeVertical.length) return alternativeVertical[0]
		}
	}
}

let total1 = 0;
let total2 = 0
patterns.forEach(pattern => {
	let columns: string[] = []
	for(let i = 0; i < pattern[0].length; i++) {
		columns.push(pattern.map(row => row[i]).join(''))
	}
	let horizontalSymmetry = getLinesOfSymmetry(pattern)
	let verticalSymmetry = getLinesOfSymmetry(columns)
	let value = 0
	if(horizontalSymmetry.length) value += horizontalSymmetry[0] * 100;
	if(verticalSymmetry.length) value += verticalSymmetry[0];
	total1 += value;
	let alternativeValue = getAlternativeValue(pattern, value);
	total2 += alternativeValue
})

console.log("Part 1: ", total1, "\nPart 2:", total2)