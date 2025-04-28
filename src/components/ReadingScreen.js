// src/components/ReadingScreen.js

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { tarotCards, cardBackImage } from '../data/tarotCards';
import TarotCard from './TarotCard';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const CARDS_PER_VIEW_MOBILE = 13; // Number of cards to show at once on mobile

const ReadingScreen = () => {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [scrollOffset, setScrollOffset] = useState(0); // float, can be fractional
  const initialStartIndex = useRef(0);
  const isWeb = Platform.OS === 'web';
  const panRef = useRef();
  const dragX = useRef(0);
  
  useEffect(() => {
    shuffleCards();
  }, []);
  
  const shuffleCards = () => {
    // First reset all states
    setSelectedCardId(null);
    // Reset startIndex to center after shuffle
    const CARD_WIDTH = width * 0.2;
    const MIN_VISIBLE_CARDS = 12;
    const MAX_VISIBLE_CARDS = 26;
    let visibleCards = Math.floor(width / (CARD_WIDTH * 0.7)); // 0.7 for overlap
    visibleCards = Math.max(MIN_VISIBLE_CARDS, Math.min(MAX_VISIBLE_CARDS, visibleCards));
    const middle = Math.floor(tarotCards.length / 2);
    const halfWindow = Math.floor(visibleCards / 2);
    setScrollOffset(middle - halfWindow);
    
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
      // Mobile version - show only a window of visible cards, starting at scrollOffset
      const CARD_WIDTH = width * 0.2;
      const MIN_VISIBLE_CARDS = 12;
      const MAX_VISIBLE_CARDS = 26;
      let visibleCards = Math.floor(width / (CARD_WIDTH * 0.7)); // 0.7 for overlap
      visibleCards = Math.max(MIN_VISIBLE_CARDS, Math.min(MAX_VISIBLE_CARDS, visibleCards));
      // Calculate the center index for the visible window
      const maxOffset = cards.length - visibleCards;
      let centerOffset = Math.max(0, Math.min(maxOffset, scrollOffset));
      // The visible window is always visibleCards wide, but can be fractional offset
      const start = Math.floor(centerOffset);
      const end = Math.min(cards.length, start + visibleCards + 1); // +1 for smooth edge
      const visible = cards.slice(start, end);

      // Gesture handler for dragging
      const onGestureEvent = (event) => {
        const { translationX, state } = event.nativeEvent;
        if (state === 2) { // BEGAN
          initialStartIndex.current = scrollOffset;
        } else if (state === 4) { // ACTIVE
          // Calculate offset in cards (float)
          let offset = -translationX / CARD_WIDTH;
          let newOffset = initialStartIndex.current + offset;
          newOffset = Math.max(0, Math.min(cards.length - visibleCards, newOffset));
          setScrollOffset(newOffset);
        } else if (state === 5) { // END
          // Snap to nearest
          let offset = -translationX / CARD_WIDTH;
          let newOffset = initialStartIndex.current + offset;
          newOffset = Math.max(0, Math.min(cards.length - visibleCards, newOffset));
          setScrollOffset(Math.round(newOffset));
        }
      };

      return (
        <PanGestureHandler
          ref={panRef}
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onGestureEvent}
        >
          <View style={styles.cardArcContainer}>
            {visible.map((card, index) => (
              <TarotCard
                key={card.id}
                card={card}
                index={index}
                totalCards={visible.length}
                cardBackImage={cardBackImage}
                onSelect={handleSelectCard}
                isSelected={selectedCardId === card.id}
                scrollOffset={centerOffset - start} // pass fractional offset for smooth arc
              />
            ))}
          </View>
        </PanGestureHandler>
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
  cardArcContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: height * 0.35, // Adjust as needed for arc height
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
  }
});

export default ReadingScreen;