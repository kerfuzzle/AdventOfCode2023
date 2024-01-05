import * as fs from 'fs';
class Vec3 { 
	x: number; y: number; z: number;
	constructor(x: number, y: number, z: number) {
		this.x = x; this.y = y; this.z = z;
	}
	
	multiply(k: number) {
		this.x *= k; this.y *= k; this.z *= k;
	}

	static add(a: Vec3, b: Vec3) {
		return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
	}

	static equal(a: Vec3, b: Vec3): boolean {
		return a.x === b.x && a.y === b.y && a.z === b.z;
	}

	static cross(a: Vec3, b: Vec3): Vec3 {
		return new Vec3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x)
	}
}

class Hailstone { 
	r: Vec3;
	v: Vec3;
	constructor(px: number, py: number, pz: number, vx: number, vy: number, vz: number) {
		this.r = new Vec3(px, py, pz);
		this.v = new Vec3(vx, vy, vz)
	}

	static findPathOverlap(A: Hailstone, B: Hailstone): [number, number] | undefined {
		const numerator = A.r.x * A.v.y * B.v.x - B.r.x * A.v.x * B.v.y + B.r.y * A.v.x * B.v.x - A.r.y * A.v.x * B.v.x
		const denominator = A.v.y * B.v.x - A.v.x * B.v.y;
		if(denominator === 0) return undefined
		const x = numerator / denominator;
		const tA = (x - A.r.x) / A.v.x;
		const tB = (x - B.r.x) / B.v.x;
		const y = A.r.y + A.v.y * tA;
		if(tA < 0 || tB < 0) return undefined;
		return [x, y];
	}
}

const lines = fs.readFileSync('./inputs/day24.txt', 'utf-8').split("\r\n");
const hailstones = lines.map(line => {
	const [px, py, pz, vx, vy, vz] = line.replace(/\s/g, '').split(/[@,]/g).map(string => parseInt(string))
	return new Hailstone(px, py, pz, vx, vy, vz);
})

let total = 0;
const min = 200000000000000;
const max = 400000000000000;
for(let i = 0; i < hailstones.length - 1; i++) {
	for(let j = i + 1; j < hailstones.length; j++) {
		const result = Hailstone.findPathOverlap(hailstones[i], hailstones[j])
		if(result) {
			if(result[0] >= min && result[0] <= max && result[1] >= min && result[1] <= max) total++
		}
	}
}
console.log("Part 1:", total);

function augment(matrix: number[][], vec: number[]) {
	matrix.forEach((row, index) => row.push(vec[index]))
}


// HUGE THANKS to https://old.reddit.com/r/adventofcode/comments/18pnycy/2023_day_24_solutions/kepu26z/ and https://github.com/jmd-dk/advent-of-code/blob/main/2023/solution/24/solve.py
function createSystem(hailstones: Hailstone[]) {
	const matrix = []
	let rhs = []
	for(let i = 0; i < 2; i++) {
		const [hi, hj] = [hailstones[i], hailstones[i + 1]]
		const iCross = Vec3.cross(hi.r, hi.v)
		const jCross = Vec3.cross(hj.r, hj.v)
		rhs = rhs.concat([iCross.z - jCross.z, iCross.y - jCross.y, iCross.x - jCross.x])
		let rowV = [hi.v.y - hj.v.y, hj.v.x - hi.v.x, 0]
		let rowP = [hj.r.y - hi.r.y, hi.r.x - hj.r.x, 0]
		matrix.push(rowV.concat(rowP));
		rowV = [hj.v.z - hi.v.z, 0, hi.v.x - hj.v.x]
		rowP = [hi.r.z - hj.r.z, 0, hj.r.x - hi.r.x]
		matrix.push(rowV.concat(rowP))
		rowV = [0, hi.v.z - hj.v.z, hj.v.y - hi.v.y]
		rowP = [0, hj.r.z - hi.r.z, hi.r.y - hj.r.y]
		matrix.push(rowV.concat(rowP))
	}
	augment(matrix, rhs);
	return matrix
}

function partialPivot(matrix: number[][]) {
	for(let i = 0; i < matrix.length; i++) {
		let pivotRow = i;
		//Find the row with the largest absolute value in the ith column
		for(let j = i + 1; j < matrix.length; j++) {
			if(Math.abs(matrix[j][i]) > Math.abs(matrix[pivotRow][i])) pivotRow = j
		}
		// Swap rows (Ri <-> Rj)
		if(pivotRow != i) {
			for(let j = i; j <= matrix.length; j++) {
				[matrix[i][j], matrix[pivotRow][j]] = [matrix[pivotRow][j], matrix[i][j]]
			}
		}
		// Ri + cRj
		for(let j = i + 1; j < matrix.length; j++) {
			let factor = matrix[j][i] / matrix[i][i];
			for(let k = i; k <= matrix.length; k++) {
				matrix[j][k] -= factor * matrix[i][k]
			}
		}
	}
}

function backSubstitute(matrix: number[][]) {
	const solutionVec = Array(matrix.length)
	for(let i = matrix.length - 1; i >= 0; i--) {
		let sum = 0;
		for(let j = i + 1; j < matrix.length; j++) sum += matrix[i][j] * solutionVec[j]
		solutionVec[i] = (matrix[i][matrix.length] - sum) / matrix[i][i]
	}
	return solutionVec
}

const system = createSystem(hailstones);
partialPivot(system)
const result = backSubstitute(system)
console.log(`Part 2: ${result.slice(0, 3).reduce((a, b) => a + b)} (P = (${result.slice(0, 3).join(', ')}), V = (${result.slice(3, 6).join(', ')}))`)