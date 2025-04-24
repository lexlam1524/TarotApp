// src/components/TarotCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate, 
  Extrapolate 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.2;
const CARD_HEIGHT = CARD_WIDTH * 1.7;

const TarotCard = ({ card, index, totalCards, cardBackImage, onSelect }) => {
  const flipped = useSharedValue(0);
  const selected = useSharedValue(0);
  const calculatePosition = () => {
    const totalWidth = width * 0.9;
    const horizontalSpacing = totalWidth / (totalCards - 1);
    const startX = width * 0.05;
    const xPosition = startX + (horizontalSpacing * index);
    
    const maxArcHeight = 150;
    const arcHeight = maxArcHeight * Math.sin((index / (totalCards - 1)) * Math.PI);
    
    const maxRotation = 30;
    const normalizedPosition = index / (totalCards - 1);
    const rotation = maxRotation * (normalizedPosition - 0.5) * 2;
    
    return {
      position: 'absolute',
      transform: [
        { rotate: `${rotation}deg` }
      ],
      left: xPosition,
      bottom: 50,
      marginTop: 20,
      transform: [
        { translateY: -arcHeight }
      ]
    };
  };  
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(
      flipped.value,
      [0, 1],
      [180, 360],
      Extrapolate.CLAMP
    );
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${spin}deg` },
      ],
      opacity: interpolate(
        flipped.value,
        [0.5, 1],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(
      flipped.value,
      [0, 1],
      [0, 180],
      Extrapolate.CLAMP
    );
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${spin}deg` },
      ],
      opacity: interpolate(
        flipped.value,
        [0, 0.5],
        [1, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateY: interpolate(
            selected.value,
            [0, 1],
            [0, -50],
            Extrapolate.CLAMP
          )
        }
      ]
    };
  });

  const handlePress = () => {
    if (selected.value === 0) {
      selected.value = withTiming(1, { duration: 300 });
      onSelect(card.id);
      setTimeout(() => {
        flipped.value = withTiming(1, { duration: 600 });
      }, 300);
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={handlePress}
      style={[styles.cardContainer, calculatePosition()]}
    >
      <Animated.View style={[styles.wrapper, translateStyle]}>
        {/* Front of card */}
        <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
          <Image 
            source={card.image}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <Text style={styles.cardName}>{card.name}</Text>
        </Animated.View>

        {/* Back of card */}
        <Animated.View style={[styles.cardFace, backAnimatedStyle]}>
          <Image 
            source={cardBackImage}
            style={styles.cardImage}
            resizeMode="cover"
          />
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
  wrapper: {
    width: '100%',
    height: '100%',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    ...Platform.select({
      web: {
        backfaceVisibility: 'hidden',
      },
      default: {
        backfaceVisibility: 'hidden',
      },
    }),
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
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