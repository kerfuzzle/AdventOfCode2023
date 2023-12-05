import * as fs from 'fs';

class Conversion {
	destStart: number;
	sourceStart: number;
	range: number;
	constructor(destStart: number, sourceStart: number, range: number) {
		this.destStart = destStart;
		this.sourceStart = sourceStart;
		this.range = range;
	}
}

function getNextConverter(sourceValue: number, categoryIndex: number) {
	const categoryConverters = converters[categoryIndex];
	const converter = categoryConverters.find(converter => converter.sourceStart <= sourceValue && sourceValue <= converter.sourceStart + converter.range - 1);
	let destValue = sourceValue;
	if(converter) destValue = converter.destStart + (sourceValue - converter.sourceStart)
	if(categoryIndex == converters.length - 1) return destValue;
	else return getNextConverter(destValue, categoryIndex + 1);
}

const categories = fs.readFileSync('./inputs/day5.txt', 'utf-8').split(/\n\s*\n/).map(category => category.split('\r\n'))
let converters: Conversion[][] = [];
let closest: number = 0;
const seeds = categories[0][0].replace('\r', '').split(': ')[1].split(' ').map(number => parseInt(number))
categories.shift();
categories.forEach(category => {
	category.shift()
	let array: Conversion[] = [];
	category.forEach(line => {
		let components = line.replace('\r', '').split(' ').map(component => parseInt(component))
		array.push(new Conversion(components[0], components[1], components[2]))
	})
	converters.push(array);
});

/* Pt. 1
seeds.forEach(seed => {
	let distance = getNextConverter(seed, 0);
	if(!closest || distance < closest) closest = distance
})
*/

for(let i = 0; i < seeds.length; i += 2) {
	console.log(seeds[i], seeds[i + 1])
	
	for(let j = 0; j < seeds[i + 1]; j++) {
		let distance = getNextConverter(seeds[i] + j, 0);
		if(!closest || distance < closest) closest = distance
	}
}

console.log(closest)
