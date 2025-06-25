// components/EvolutionSuccessScreen.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';


const EvolutionSuccessScreen = ({ visible, creature, onClose }) => {
  if (!creature) return null;


  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={creature.image} style={styles.image} />
        </View>
        
        <Text style={styles.creatureName}>{creature.name}</Text>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  creatureName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 100,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default EvolutionSuccessScreen;