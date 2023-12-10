import * as fs from 'fs';
let lines = fs.readFileSync('./inputs/day9.txt', 'utf-8').split("\r\n");

let total = 0
lines.forEach(line => {
	let differenceArrays = [line.split(' ').map(string => parseInt(string))]
	while(!differenceArrays[differenceArrays.length - 1].every(item => item === 0)){
		let newArray: number[] = [];
		let currentArray = differenceArrays[differenceArrays.length - 1];
		for(let i = 1; i < currentArray.length; i++) {
			newArray.push(currentArray[i] - currentArray[i - 1])
		}
		differenceArrays.push(newArray)
	}

	for(let i = differenceArrays.length - 2; i >= 0; i--) {
		// Pt. 1
		differenceArrays[i].push(differenceArrays[i][differenceArrays[i].length - 1] + differenceArrays[i + 1][differenceArrays[i + 1].length - 1])
		// Pt. 2
		// differenceArrays[i].unshift(differenceArrays[i][0] - differenceArrays[i + 1][0])
	}

	// Pt. 1
	total += differenceArrays[0][differenceArrays[0].length - 1]
	// Pt. 2
	// total += differenceArrays[0][0]
})

console.log(total)