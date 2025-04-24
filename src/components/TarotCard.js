// src/components/TarotCard.js

import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.2;
const CARD_HEIGHT = CARD_WIDTH * 1.7;

const TarotCard = ({ card, index, totalCards, cardBackImage, onSelect }) => {
  const flipped = useSharedValue(0);
  const selected = useSharedValue(0);
  
  // Animation styles
  const animatedCardStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      flipped.value,
      [0, 1],
      [0, 180]
    );
    
    const translateY = interpolate(
      selected.value,
      [0, 1],
      [0, -50]
    );
    
    return {
      transform: [
        { rotateY: `${rotateY}deg` },
        { translateY }
      ]
    };
  });
  
  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: flipped.value,
      transform: [{ rotateY: '180deg' }],
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
    };
  });
  
  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - flipped.value,
      backfaceVisibility: 'hidden',
    };
  });

  // Calculate fan position
  const calculatePosition = () => {
    // Calculate horizontal position
    const totalWidth = width * 0.9; // Use 90% of screen width
    const horizontalSpacing = totalWidth / (totalCards - 1);
    const startX = width * 0.05; // Start at 5% of screen width
    const xPosition = startX + (horizontalSpacing * index);
    
    // Calculate arc position
    const maxArcHeight = 150; // Maximum height of the arc
    // Create parabolic arc effect
    const arcHeight = maxArcHeight * Math.sin((index / (totalCards - 1)) * Math.PI);
    
    // Calculate rotation (cards at edges rotate more than center)
    const maxRotation = 30; // Maximum rotation angle
    const normalizedPosition = index / (totalCards - 1); // 0 to 1
    const rotation = maxRotation * (normalizedPosition - 0.5) * 2; // -30 to +30 degrees
    
    return {
        position: 'absolute',
        transform: [
            { rotate: `${rotation}deg` }
        ],
        left: xPosition,
        bottom: 50, // Distance from bottom of screen
        marginTop: 20,
        translateY: -arcHeight // Lift cards in arc pattern
    };
  };

  const handlePress = () => {
    if (selected.value === 0) {
      // Card is not selected yet, select it
      selected.value = withTiming(1, { duration: 300 });
      onSelect(card.id); // Tell parent this card was selected
    } else {
      // Card is already selected, flip it
      flipped.value = withTiming(1, { duration: 300 });
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={handlePress}
      style={[styles.cardContainer, calculatePosition()]}
    >
      <Animated.View style={[styles.card, animatedCardStyle]}>
        <Animated.View style={[styles.cardSide, backAnimatedStyle]}>
          <Image source={cardBackImage} style={styles.cardImage} resizeMode="cover" />
        </Animated.View>
        
        <Animated.View style={[styles.cardSide, frontAnimatedStyle]}>
          <Image source={card.image} style={styles.cardImage} resizeMode="cover" />
          <Text style={styles.cardName}>{card.name}</Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cardSide: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  cardName: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'white',
    paddingVertical: 5,
  }
});

export default TarotCard;