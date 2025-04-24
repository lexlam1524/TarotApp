// src/components/ReadingScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { tarotCards, cardBackImage } from '../data/tarotCards';
import TarotCard from './TarotCard';

const { width, height } = Dimensions.get('window');

const ReadingScreen = () => {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [showMeaning, setShowMeaning] = useState(false);
  
  useEffect(() => {
    shuffleCards();
  }, []);
  
  const shuffleCards = () => {
    // Create a copy of the cards array and shuffle it
    const shuffled = [...tarotCards]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    
    setCards(shuffled);
    setSelectedCardId(null);
    setShowMeaning(false);
  };
  
  const handleSelectCard = (cardId) => {
    setSelectedCardId(cardId);
    
    // Add delay before showing meaning
    setTimeout(() => {
      setShowMeaning(true);
    }, 1000);
  };
  
  const selectedCard = cards.find(card => card.id === selectedCardId);
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Tarot Reading</Text>
        <TouchableOpacity onPress={shuffleCards} style={styles.shuffleButton}>
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
          />
        ))}
      </View>
      
      <Modal
        visible={showMeaning}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMeaning(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedCard?.name}</Text>
            
            <ScrollView style={styles.meaningContainer}>
              <Text style={styles.meaningTitle}>Upright Meaning:</Text>
              <Text style={styles.meaningText}>{selectedCard?.meaning}</Text>
              
              <Text style={styles.meaningTitle}>Reversed Meaning:</Text>
              <Text style={styles.meaningText}>{selectedCard?.reversedMeaning}</Text>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowMeaning(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.8,
    maxHeight: height * 0.7,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8A2BE2',
  },
  meaningContainer: {
    width: '100%',
    marginBottom: 20,
  },
  meaningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  meaningText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReadingScreen;