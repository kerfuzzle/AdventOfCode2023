import * as fs from 'fs';
const lines = fs.readFileSync('./inputs/day7.txt', 'utf-8').split("\r\n");
//const cardRanking = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
const cardRanking = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'] // Pt. 2

class Hand {
	bid: number = 0;
	typeRank: number = 0;
	cards: string[] = [];
}

function getTypeRank(hand: Hand) {
	let ranks: number[] = []
	cardRanking.forEach(target => {
		let noOccurences = 0;
		hand.cards.forEach(card => {
			if(card == target) noOccurences ++;
		});
		ranks.push(noOccurences);
	})
	ranks.sort((a, b) => b - a);
	if(ranks[0] == 5) return 6;
	if(ranks[0] == 4) return 5;
	if(ranks[0] == 3 && ranks[1] == 2) return 4;
	if(ranks[0] == 3) return 3;
	if(ranks[0] == 2 && ranks[1] == 2) return 2;
	if(ranks[0] == 2) return 1;
	return 0;
}

function getTypeRankPt2(hand: Hand) {
	let ranks: number[] = []
	let jokerCount = 0;
	hand.cards.forEach(card => {
		if(card == 'J') jokerCount ++;
	})
	cardRanking.forEach(target => {
		let noOccurences = 0;
		hand.cards.forEach(card => {
			if(card == target) noOccurences++;
		});
		if(target !== 'J') ranks.push(noOccurences);
	})
	ranks.sort((a, b) => b - a);
	ranks[0] += jokerCount;
	if(ranks[0] == 5) return 6;
	if(ranks[0] == 4) return 5;
	if(ranks[0] == 3 && ranks[1] == 2) return 4;
	if(ranks[0] == 3) return 3;
	if(ranks[0] == 2 && ranks[1] == 2) return 2;
	if(ranks[0] == 2) return 1;
	return 0;
}

function compareHands(handA: Hand, handB: Hand) {
	if(handA.typeRank > handB.typeRank) return 1;
	if(handB.typeRank > handA.typeRank) return -1;
	for(let i = 0; i < handA.cards.length; i++) {
		let handACard = handA.cards[i];
		let handBCard = handB.cards[i];
		if(cardRanking.indexOf(handACard) > cardRanking.indexOf(handBCard)) return 1
		if(cardRanking.indexOf(handBCard) > cardRanking.indexOf(handACard)) return -1
	}
	return 0;
}


let hands: Hand[] = []
lines.forEach(line => {
	let hand = new Hand();
	hand.cards = line.split(' ')[0].split('')
	hand.bid = parseInt(line.split(' ')[1])
	//hand.typeRank = getTypeRank(hand);
	hand.typeRank = getTypeRankPt2(hand);
	hands.push(hand);
})

let total = 0;
hands.sort((a, b) => compareHands(a, b))
hands.forEach((hand, index) => {
	total += hand.bid * (index + 1)
})

console.log(total)
