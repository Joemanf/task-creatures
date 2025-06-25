import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const EvolutionRevealScreen = ({ route, navigation }) => {
  const { creature } = route.params;
  
  return (
    <View style={styles.container}>
      <Image source={creature.image} style={styles.image} />
      <Text style={styles.name}>{creature.name}</Text>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => navigation.replace('CreatureDetail', { ownedId: creature.ownedId })}
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '50%',
    resizeMode: 'contain',
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 60,
  },
  closeButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#F44336',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default EvolutionRevealScreen;