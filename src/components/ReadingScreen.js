// src/components/ReadingScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { tarotCards, cardBackImage } from '../data/tarotCards';
import TarotCard from './TarotCard';

const { width, height } = Dimensions.get('window');
const CARDS_PER_VIEW_MOBILE = 13; // Number of cards to show at once on mobile

const ReadingScreen = () => {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const isWeb = Platform.OS === 'web';
  
  useEffect(() => {
    shuffleCards();
  }, []);
  
  const shuffleCards = () => {
    // First reset all states
    setSelectedCardId(null);
    
    // Then after a short delay, shuffle the cards
    setTimeout(() => {
      const shuffled = [...tarotCards]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      
      setCards(shuffled);
    }, 300); // 300ms delay to allow reset animation to complete
  };
  
  const handleSelectCard = (cardId) => {
    setSelectedCardId(cardId);
  };

  const renderCards = () => {
    if (isWeb) {
      // Web version - render all cards in one view
      return (
        <View style={styles.cardDeckContainer}>
          {cards.map((card, index) => (
            <TarotCard
              key={card.id}
              card={card}
              index={index}
              totalCards={cards.length}
              cardBackImage={cardBackImage}
              onSelect={handleSelectCard}
              isSelected={selectedCardId === card.id}
            />
          ))}
        </View>
      );
    } else {
      // Mobile version - render in scrollable view
      return (
        <ScrollView 
          horizontal
          contentContainerStyle={styles.scrollViewContent}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={width * 0.8} // Snap to sections
        >
          {Array(Math.ceil(cards.length / CARDS_PER_VIEW_MOBILE)).fill(0).map((_, pageIndex) => (
            <View 
              key={pageIndex} 
              style={[styles.cardDeckContainer, { width: width }]}
            >
              {cards.slice(
                pageIndex * CARDS_PER_VIEW_MOBILE,
                (pageIndex + 1) * CARDS_PER_VIEW_MOBILE
              ).map((card, index) => (
                <TarotCard
                  key={card.id}
                  card={card}
                  index={index}
                  totalCards={CARDS_PER_VIEW_MOBILE}
                  cardBackImage={cardBackImage}
                  onSelect={handleSelectCard}
                  isSelected={selectedCardId === card.id}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      );
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Tarot Reading</Text>
        <TouchableOpacity onPress={shuffleCards} style={styles.shuffleButton}>
          <Text style={styles.shuffleButtonText}>Shuffle</Text>
        </TouchableOpacity>
      </View>
      
      {renderCards()}
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
  },
  scrollViewContent: {
    flexGrow: 1,
  }
});

export default ReadingScreen;