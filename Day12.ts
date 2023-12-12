import * as fs from 'fs';
let lines = fs.readFileSync('./inputs/day12.txt', 'utf-8').split("\r\n");

function memo<Arguments extends unknown[], Result>(func: (...args: Arguments) => Result): (...args: Arguments) => Result {
	const resultMap = new Map<string, Result>();
	return (...args): Result => {
		const argsJSON = JSON.stringify(args)
		if(resultMap.has(argsJSON)) {
			return resultMap.get(argsJSON)
		}
		const result = func(...args);
		resultMap.set(argsJSON, result);
		return result;
	}
}

class Row {
	springs: string;
	groupValues: number[];
	constructor(springs: string, groups: number[]) {
		this.springs = springs; this.groupValues = groups;
	}

	getCombinations() {
		let springGroups = this.springs.split('.').filter(springGroup => springGroup !== '')
		if(springGroups.length == 1) {
			if(this.groupValues.length == 1) return springGroups[0].length - this.groupValues[0] + 1;
			if(springGroups[0].length === this.groupValues.reduce((a, b) => a + b) + this.groupValues.length - 1) return 1;
		}
		//Most of the easy cases have been removed, brute-force time
		return Row.bruteForceCombinations(springGroups.join('.'), this.groupValues)
	}

	private static bruteForceCombinations = memo((springString: string, groupValues: number[]) => {
		if(springString.length === 0) {
			if(groupValues.length === 0) return 1
			return 0;
		}
		if(groupValues.length === 0) {
			if(springString.split('').includes('#')) return 0;
			return 1;
		}
		
		if(springString.length < groupValues.reduce((a, b) => a + b) + groupValues.length - 1) return 0
		if(springString[0] === ".") return this.bruteForceCombinations(springString.slice(1), groupValues);
		if(springString[0] === '#') {
			const [firstGroupValue, ...remainingGroupValues] = groupValues;
			if(springString[firstGroupValue] === '#') return 0;
			for(let i = 0; i < firstGroupValue; i++) {
				if(springString[i] === '.') return 0;
			}
			return this.bruteForceCombinations(springString.slice(firstGroupValue + 1), remainingGroupValues);
		}
		//Nothing found, give it somewhere to start
		return this.bruteForceCombinations('#' + springString.slice(1), groupValues) + this.bruteForceCombinations('.' + springString.slice(1), groupValues)
	})
}

let total = 0;
let rows = lines.map(line => new Row(line.split(' ')[0], line.split(' ')[1].split(',').map(string => parseInt(string))))
rows.forEach(row => {
	total += row.getCombinations()
})
console.log("Part 1: ", total)

let secondTotal = 0;
rows.forEach(row => {
	row.springs = [row.springs, row.springs, row.springs, row.springs, row.springs].join('?')
	row.groupValues = [...row.groupValues, ...row.groupValues, ...row.groupValues, ...row.groupValues, ...row.groupValues]
	secondTotal += row.getCombinations()
})

console.log("Part 2: ", secondTotal)