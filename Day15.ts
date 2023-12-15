import * as fs from 'fs';
let line = fs.readFileSync('./inputs/day15.txt', 'utf-8').split("\r\n")[0];

function hash(string: string) {
	let subtotal = 0;
	string.split('').forEach(char => {
		subtotal += char.charCodeAt(0);
		subtotal *= 17;
		subtotal %= 256;
	})
	return subtotal
}

const boxes = new Map<number, lens[]>();
type lens = { label: string, focalLength: number }

line.split(',').forEach(step => {
	const [label, valueString] = step.split(/=|-/)
	const value = parseInt(valueString);
	const labelHash = hash(label);
	//console.log(labelHash, value)
	if(!isNaN(value)) {
		if(boxes.has(labelHash)) {
			const current = boxes.get(labelHash);
			const currentLens = current.findIndex(lens => lens.label === label);
			if(currentLens !== -1) current[currentLens].focalLength = value
			else current.push({ label: label, focalLength: value });
			boxes.set(labelHash, current);
		} else boxes.set(labelHash, [{ label: label, focalLength: value }]);
	} else {
		if(boxes.has(labelHash)) {
			const current = boxes.get(labelHash);
			boxes.set(labelHash, current.filter(lens => lens.label !== label))
		}
	}
})

let sum = 0;
boxes.forEach((value, key) => {
	value.forEach((lens, index) => {
		sum += lens.focalLength * (index + 1) * (key + 1)
	})
})

console.log("Part 1:", line.split(',').map(hash).reduce((a, b) => a + b));
console.log("Part 2:", sum);