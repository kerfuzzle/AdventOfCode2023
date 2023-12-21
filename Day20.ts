import * as fs from 'fs';
enum PulseType {
	LOW, HIGH
}
type Pulse = { source: string, type: PulseType }
type Module = BroadcastModule | FlipFlopModule | ConjunctionModule | ButtonModule;
type Output = { destinationModule : Module, source: string, type: PulseType }
let proccessQueue: Output[] = []
class BroadcastModule {
	name: string;
	outputs: string[] = [];
	runModule(input: Pulse): void {
		this.sendOutputs(input.type)
	}

	sendOutputs(output: PulseType): void {
		for(let i = 0; i < this.outputs.length; i++) {
			if(output === PulseType.HIGH) highCount++;
			else lowCount++;
			const outputModule = modules.get(this.outputs[i]);
			if(outputModule) proccessQueue.push({ destinationModule: outputModule, source: this.name, type: output })
		}
		while(proccessQueue.length > 0) {
			const process = proccessQueue.shift()
			process.destinationModule.runModule({ source: process.source, type: process.type })
		}
	}

	constructor(name: string, outputs?: string[]) {
		this.name = name; this.outputs = outputs;
	}
}

class FlipFlopModule extends BroadcastModule {
	state: boolean = false;
	runModule(input: Pulse): void {
		if(input.type === PulseType.HIGH) return
		let outputType: PulseType = PulseType.HIGH;
		if(this.state) outputType = PulseType.LOW;
		this.state = !this.state
		this.sendOutputs(outputType)
	}
}

class ConjunctionModule extends BroadcastModule {
	pulseMemory: Map<string, PulseType> = new Map<string, PulseType>();
	runModule(input: Pulse): void {
		this.pulseMemory.set(input.source, input.type);
		if([...this.pulseMemory.values()].every(type => type === PulseType.HIGH)) this.sendOutputs(PulseType.LOW)
		else this.sendOutputs(PulseType.HIGH)
	}

	addInput(moduleName: string) {
		this.pulseMemory.set(moduleName, PulseType.LOW);
	}
}

class ButtonModule extends BroadcastModule {
	outputs: string[] = ['broadcaster'];
	runModule(_: Pulse): void {
		this.sendOutputs(PulseType.LOW)
	}
}

function gcd(a: number, b: number): number {
	if(b === 0) return a;
	return gcd(b, a % b);
}

function lcm(array: number[]): number {
	let result = array[0];
	for(let i = 1; i < array.length; i++){
		result = (result * array[i]) / gcd(result, array[i])
	}
	return result;
}

function parseLine(line: string): [string, string, string[]] {
	const [nameString, outputsString] = line.replace(/\s/g, '').split('->');

	return [nameString[0], nameString.slice(1), outputsString.split(',')]
}

function loadModules(lines: string[]): Map<string, Module> {
	let modules = new Map<string, Module>()
	lines.forEach(line => {
		if(line[0] !== '&') return;
		const [type, name, outputs] = parseLine(line);
		modules.set(name, new ConjunctionModule(name, outputs))
	})
	lines.forEach(line => {
		const [type, name, outputs] = parseLine(line);
		outputs.forEach(outputName => {
			const outputModule = modules.get(outputName)
			if(outputModule instanceof ConjunctionModule) outputModule.addInput(name)
		})
		if(type === 'b') modules.set('broadcaster', new BroadcastModule('broadcaster', outputs))
		else if(type === '%') modules.set(name, new FlipFlopModule(name, outputs))
	})
	return modules;
}

let lowCount = 0;
let highCount = 0;
let lines = fs.readFileSync('./inputs/day20.txt', 'utf-8').split("\r\n");
let modules = loadModules(lines)

const button = new ButtonModule('button')
for(let i = 0; i < 1000; i++) {
	button.runModule(null);
}
console.log("Part 1:", lowCount * highCount)

modules = loadModules(lines);
type Cycle = { module: Module, cycleLength: undefined | number }
const penultimateModule = [...modules.values()].find(module => module.outputs.includes('rx')) as ConjunctionModule
const penultimateModuleInputs = [...penultimateModule.pulseMemory.keys()].map(name => modules.get(name))
const cycles: Cycle[] = penultimateModuleInputs.map(module => ({ module: module, cycleLength: undefined }))
penultimateModule.runModule = (input: Pulse) => {
	if(input.type === PulseType.HIGH) {
		const cycle = cycles.find(cycle => cycle.module.name === input.source);
		if(cycle && cycle.cycleLength === undefined) cycle.cycleLength = pressCount;
	}
}
let pressCount = 0;
while(!cycles.every(cycle => cycle.cycleLength !== undefined)) {
	pressCount++
	button.runModule(null);
}
console.log("Part 2:", lcm(cycles.map(cycle => cycle.cycleLength)));