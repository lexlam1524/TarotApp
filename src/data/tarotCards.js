// src/data/tarotCards.js

// Major Arcana
const majorArcana = [
  { id: 0, name: "The Fool", image: require('../assets/images/placeholder.png') },
  { id: 1, name: "The Magician", image: require('../assets/images/placeholder.png') },
  { id: 2, name: "The High Priestess", image: require('../assets/images/placeholder.png') },
  { id: 3, name: "The Empress", image: require('../assets/images/placeholder.png') },
  { id: 4, name: "The Emperor", image: require('../assets/images/placeholder.png') },
  { id: 5, name: "The Hierophant", image: require('../assets/images/placeholder.png') },
  { id: 6, name: "The Lovers", image: require('../assets/images/placeholder.png') },
  { id: 7, name: "The Chariot", image: require('../assets/images/placeholder.png') },
  { id: 8, name: "Strength", image: require('../assets/images/placeholder.png') },
  { id: 9, name: "The Hermit", image: require('../assets/images/placeholder.png') },
  { id: 10, name: "Wheel of Fortune", image: require('../assets/images/placeholder.png') },
  { id: 11, name: "Justice", image: require('../assets/images/placeholder.png') },
  { id: 12, name: "The Hanged Man", image: require('../assets/images/placeholder.png') },
  { id: 13, name: "Death", image: require('../assets/images/placeholder.png') },
  { id: 14, name: "Temperance", image: require('../assets/images/placeholder.png') },
  { id: 15, name: "The Devil", image: require('../assets/images/placeholder.png') },
  { id: 16, name: "The Tower", image: require('../assets/images/placeholder.png') },
  { id: 17, name: "The Star", image: require('../assets/images/placeholder.png') },
  { id: 18, name: "The Moon", image: require('../assets/images/placeholder.png') },
  { id: 19, name: "The Sun", image: require('../assets/images/placeholder.png') },
  { id: 20, name: "Judgement", image: require('../assets/images/placeholder.png') },
  { id: 21, name: "The World", image: require('../assets/images/placeholder.png') },
];

// Minor Arcana Suits
const suits = ['Wands', 'Cups', 'Swords', 'Pentacles'];
const courtCards = ['Page', 'Knight', 'Queen', 'King'];

// Generate Minor Arcana cards
const minorArcana = suits.flatMap((suit, suitIndex) => {
  // Number cards (Ace through 10)
  const numberCards = Array.from({ length: 10 }, (_, i) => ({
    id: 22 + (suitIndex * 14) + i,
    name: `${i + 1} of ${suit}`,
    image: require('../assets/images/placeholder.png'),
  }));

  // Court cards (Page, Knight, Queen, King)
  const courtCardsArray = courtCards.map((court, courtIndex) => ({
    id: 22 + (suitIndex * 14) + 10 + courtIndex,
    name: `${court} of ${suit}`,
    image: require('../assets/images/placeholder.png'),
  }));

  return [...numberCards, ...courtCardsArray];
});

// Combine all cards
export const tarotCards = [...majorArcana, ...minorArcana];

export const cardBackImage = require('../assets/images/card-back.png');
