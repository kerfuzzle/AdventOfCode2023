import * as fs from 'fs'
class Part {
	x: number;
	m: number;
	a: number;
	s: number;
	constructor(x: number, m: number , a: number, s: number){
		this.x = x; this.m = m; this.a = a; this.s = s;
	}
	isAcccepted(workflows: Map<string, Workflow>) {
		const start = workflows.get('in');
		return this.recurseWorkflows(start, workflows)
	}
	private recurseWorkflows(workflow: Workflow, workflows: Map<string, Workflow>) {
		for(let i = 0; i < workflow.conditions.length; i++) {
			const result = workflow.conditions[i].function(this);			
			if(result === 0) return false;
			else if(result === 1) return true;
			else if(typeof result === "string") {
				return this.recurseWorkflows(workflows.get(result), workflows)
			}
		}
	}
}

type condition = { condition: string, destination: string, function: (part: Part) => (number | string)}
class Workflow {
	name: string;
	conditions: condition[];
	constructor(name: string, conditions: condition[]) {
		this.name = name; this.conditions = conditions;
	}
}

let [workflowStrings, partStrings] = fs.readFileSync('./inputs/day19.txt', 'utf-8').split(/\n\s*\n/).map(string => string.split('\r\n').map(string => string.replace(/[\n\r]/g, '')))
const workflows = new Map<string, Workflow>();
workflowStrings.forEach(string => {
	//const matches = [...string.matchAll(/(\w+)(?:{)(?:([xmas][<>]\d+:\w+),?)*(\w+)(?:})/g)].map(match => match.slice(-4).slice(1))[0]
	const [name, matchesString] = string.split('{')
	const matches = matchesString.replace('}', '').split(',')
	const lastRuleString = matches.pop()
	let lastRule: { (_: Part): number | string };
	if(lastRuleString === 'A') lastRule = (_: Part) => 1;
	else if(lastRuleString === 'R') lastRule = (_: Part) => 0;
	else lastRule = (_: Part) => lastRuleString;
	const conditionFunctions = matches.map(rule => {
		const [condition, result] = rule.split(':');
		const number = parseInt(condition.slice(2));
		return { condition : condition, destination: result, function: (part: Part) => {
			const variable = part[condition[0]]
			if((condition[1] === '>' && variable > number) || (condition[1] === '<' && variable < number)) {
				if(result === 'A') return 1
				else if(result === 'R') return 0
				else return result
			} return 2
		}} as condition
	})
	const workflow = new Workflow(name, [...conditionFunctions, { condition: undefined, destination: lastRuleString, function: lastRule }]) 
	workflows.set(name, workflow);
})
const parts = partStrings.map(string => {
	const matches = [...string.matchAll(/[xmas]=(\d+)/g)]
	const [x, m, a, s] = matches.map(match => parseInt(match[1]))
	return new Part(x, m, a, s);
})

let total = 0
parts.forEach(part =>{
	if(part.isAcccepted(workflows)) total += part.x + part.m + part.a + part.s
})
console.log("Part 1: ", total)

function getCombinations(currentWorkflowName: string, ranges: Ranges) {
	if(currentWorkflowName === 'R') return 0;
	if(currentWorkflowName === 'A') {
		let product = 1;
		for(let key in ranges) product *= (ranges[key].max - ranges[key].min + 1)
		return product
	}
	const currentWorkflow = workflows.get(currentWorkflowName);
	let accepted = 0;
	for(let i = 0; i < currentWorkflow.conditions.length; i++) {
		const newRanges = structuredClone(ranges)
		if(currentWorkflow.conditions[i].condition === undefined) {
			accepted += getCombinations(currentWorkflow.conditions[i].destination, newRanges)
		} else {
			const variableName = currentWorkflow.conditions[i].condition[0];
			const symbol = currentWorkflow.conditions[i].condition[1]
			const number = parseInt(currentWorkflow.conditions[i].condition.slice(2))
			const specifiedRange = newRanges[variableName] as Range;
			if(symbol === '<') {
				if(specifiedRange.min < number) {
					specifiedRange.max = number - 1
					accepted += getCombinations(currentWorkflow.conditions[i].destination, newRanges)
				}

				if(ranges[variableName].max >= number) {
					ranges[variableName].min = number
				} else break;
			} else {
				if(specifiedRange.max > number) {
					specifiedRange.min = number + 1;
					accepted += getCombinations(currentWorkflow.conditions[i].destination, newRanges)
				}

				if(ranges[variableName].min <= number) {
					ranges[variableName].max = number;
				} else break;
			}
		}
	}
	return accepted
}

type Range = { min: number, max: number };
type Ranges = { x: Range, m: Range, a: Range, s: Range}
let startingRanges: Ranges = {
	x: { min: 1, max: 4000 },
	m: { min: 1, max: 4000 },
	a: { min: 1, max: 4000 },
	s: { min: 1, max: 4000 }
}

console.log("Part 2: ", getCombinations('in', startingRanges));