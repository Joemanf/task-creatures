import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const CreatureCard = ({ creature, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(creature)} style={styles.container}>
      <View style={styles.imageContainer}>  {/* Updated: No locked styles, as owned are unlocked */}
        <Image source={creature.image} style={styles.image} />
      </View>
      <Text style={styles.name}>{creature.name}</Text>
      <Text style={styles.level}>Lv. {creature.level}</Text>  {/* Updated: Always show level for owned */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    alignItems: 'center',
    margin: 10,
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
});

export default CreatureCard;