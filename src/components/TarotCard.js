// src/components/TarotCard.js

import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Calculate card size based on platform and screen size
const getCardDimensions = () => {
  const isWeb = Platform.OS === 'web';
  const screenWidth = width;
  
  // Different size calculations for web and mobile
  if (isWeb) {
    // For web, use smaller percentages and cap the maximum size
    const maxWebWidth = 120;  // Maximum width in pixels for web
    const calculatedWidth = Math.min(screenWidth * 0.1, maxWebWidth);
    return {
      width: calculatedWidth,
      height: calculatedWidth * 1.7
    };
  } else {
    // For mobile, keep current sizing
    return {
      width: screenWidth * 0.2,
      height: screenWidth * 0.2 * 1.7
    };
  }
};

// Replace the current constants with
const { width: CARD_WIDTH, height: CARD_HEIGHT } = getCardDimensions();

const TarotCard = ({ card, index, totalCards, cardBackImage, onSelect, isSelected, scrollOffset = 0 }) => {
  const flipped = useSharedValue(0);
  const selected = useSharedValue(0);
  
  // Reset animations when isSelected changes to false
  useEffect(() => {
    if (!isSelected) {
      // Reset both animations with timing
      flipped.value = withTiming(0, { duration: 300 });
      selected.value = withTiming(0, { duration: 300 });
    }
  }, [isSelected]);

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
    const rotateY = interpolate(
      flipped.value,
      [0, 1],
      [180, 360]
    );
    
    return {
      opacity: flipped.value,
      transform: [
        { rotateY: `${rotateY}deg` },
        { scaleX: -1 }
      ],
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
    };
  });
  
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      flipped.value,
      [0, 1],
      [0, 180]
    );

    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: 1 - flipped.value,
      backfaceVisibility: 'hidden',
    };
  });

  // Calculate fan position
  const calculatePosition = () => {
    // Make arc span the full width and reduce overlap
    const totalWidth = width * 1.05; // Slightly wider than screen for edge-to-edge
    const horizontalSpacing = totalWidth / (totalCards - 1);
    const startX = 0;
    // Use fractional index for smooth movement
    const relativeIndex = index - scrollOffset;
    const xPosition = startX + (horizontalSpacing * relativeIndex);

    // Flatter arc
    const maxArcHeight = 35;
    const normalizedPosition = (relativeIndex) / (totalCards - 1);
    const arcHeight = maxArcHeight * Math.sin(Math.PI * normalizedPosition);

    // Slightly less rotation for flatter fan
    const maxRotation = 25;
    const rotation = maxRotation * (normalizedPosition - 0.5);

    return {
      position: 'absolute',
      transform: [
        { rotate: `${rotation}deg` },
        { translateY: -arcHeight + maxArcHeight }
      ],
      left: xPosition,
      bottom: 0,
      zIndex: index,
    };
  };

  const handlePress = () => {
    console.log('Card image:', card.image);
    if (selected.value === 0) {
      // Card is not selected yet, select it
      selected.value = withTiming(1, { duration: 300 });
      onSelect(card.id); // Tell parent this card was selected
    } else {
      // Card is already selected, flip it
      // console.log('Card image source:', card.image);
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
          <Image 
            source={cardBackImage} 
            style={styles.cardImage} 
            resizeMode="cover"
          />
        </Animated.View>
        
        <Animated.View style={[styles.cardSide, frontAnimatedStyle]}>
          <Image 
            source={card.image} 
            style={styles.cardImage}
            resizeMode="cover"
          />
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
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: Math.min(CARD_WIDTH * 0.1, 10),  // Responsive border radius
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
    backgroundColor: '#red',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    left: 0,
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