// src/components/ReadingScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { tarotCards, cardBackImage } from '../data/tarotCards';
import TarotCard from './TarotCard';

const { width, height } = Dimensions.get('window');

const ReadingScreen = () => {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  
  useEffect(() => {
    shuffleCards();
  }, []);
  
  const shuffleCards = () => {
    setIsShuffling(true);
    
    setTimeout(() => {
      const shuffled = [...tarotCards]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      
      setCards(shuffled);
      setSelectedCardId(null);
      setIsShuffling(false);
    }, 1000);
  };
  
  const handleSelectCard = (cardId) => {
    setSelectedCardId(cardId);
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Tarot Reading</Text>
        <TouchableOpacity 
          onPress={shuffleCards} 
          disabled={isShuffling}
          style={styles.shuffleButton}
        >
          <Text style={styles.shuffleButtonText}>Shuffle</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardDeckContainer}>
        {cards.map((card, index) => (
          <TarotCard
            key={card.id}
            card={card}
            index={index}
            totalCards={cards.length}
            cardBackImage={cardBackImage}
            onSelect={handleSelectCard}
            shouldReset={selectedCardId === null}
            isShuffling={isShuffling}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  shuffleButton: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  shuffleButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cardDeckContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.1,
  }
});

export default ReadingScreen;