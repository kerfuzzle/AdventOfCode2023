import * as fs from 'fs';
const lines = fs.readFileSync('./inputs/day4.txt', 'utf-8').split("\r\n");

class Card {
	ourNumbers: number[] = [];
	winningNumbers: number[] = [];
	wins: number = 0;
}

let cards: Card[] = []
let totalScratchCards = 0
lines.forEach(line => {
	let card = new Card;
	card.ourNumbers = line.split('|')[1].split(' ').map(number => number.replace(' ', '')).filter(number => number !== '').map(number => parseInt(number))
	card.winningNumbers = line.split('|')[0].split(':')[1].split(' ').map(number => number.replace(' ', '')).filter(number => number !== '').map(number => parseInt(number))
	card.winningNumbers.forEach(winningNumber => {
		if(card.ourNumbers.includes(winningNumber)) card.wins++
	})
	cards.push(card)
})

cards.forEach((_, index) => addCards(index))
function addCards(index: number) {
	totalScratchCards++;
	if(cards[index].wins == 0) return;
	for(let i = 1; i < cards[index].wins + 1; i++) {
		addCards(index + i)
	}
}

console.log(totalScratchCards);
