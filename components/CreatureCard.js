import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const CreatureCard = ({ creature, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(creature)} style={styles.container}>
      <View style={[styles.imageContainer, !creature.unlocked && styles.locked]}>
        <Image source={creature.image} style={styles.image} />
        {!creature.unlocked && (
          <View style={styles.lockOverlay}>
            <Text style={styles.lockText}>🔒</Text>
          </View>
        )}
      </View>
      <Text style={styles.name}>{creature.name}</Text>
      {creature.unlocked && <Text style={styles.level}>Lv. {creature.level}</Text>}
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
  locked: {
    borderColor: '#ccc',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockText: {
    fontSize: 24,
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