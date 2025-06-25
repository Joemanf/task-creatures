// screens/EvolutionSuccessScreen.js (New File)
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';


const EvolutionSuccessScreen = ({ route, navigation }) => {
  const { evolvedCreature } = route.params;
  
  const handleClose = () => {
    navigation.navigate('CreatureDetail', { ownedId: evolvedCreature.ownedId });
  };


  return (
    <View style={styles.container}>
      <Image source={evolvedCreature.image} style={styles.image} />
      <Text style={styles.name}>{evolvedCreature.name}</Text>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={handleClose}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '80%',
    height: '60%',
    resizeMode: 'contain',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    position: 'absolute',
    bottom: '30%',
    left: 0,
    right: 0,
  },
  closeButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default EvolutionSuccessScreen;