import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppContext } from '../contexts/AppContext';

const CreatureCard = ({ creature, onPress }) => {
  const { selectedCreature } = useAppContext();
  
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.cardContent}>
        {selectedCreature === creature.ownedId && (
          <View style={styles.activeIndicator}>
            <Text style={styles.activeText}>A</Text>
          </View>
        )}
        <View style={styles.imageContainer}>
          <Image source={creature.image} style={styles.image} />
        </View>
      </View>
      <Text style={styles.name}>{creature.name}</Text>
      <Text style={styles.level}>Lv. {creature.level}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    alignItems: 'center',
    margin: 10,
  },
  cardContent: {
    position: 'relative', // Needed for absolute positioning of children
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  level: {
    fontSize: 12,
    color: '#666',
  },
  activeIndicator: {
    position: 'absolute',
    top: -3,    // Move it above the container
    left: -3,   // Move it left of the container
    backgroundColor: '#4CAF50',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: 'white', // Optional: adds contrast against background
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CreatureCard;