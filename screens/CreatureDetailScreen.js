import React, { useContext, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import XPBar from '../components/XPBar';

const CreatureDetailScreen = ({ route, navigation }) => {
  const { ownedCreatures, selectedCreature, releaseCreature, setActiveCreature } = useAppContext();
  const { ownedId } = route.params;
  
  const creature = ownedCreatures.find(c => c.ownedId === ownedId);
  const [showReleaseModal, setShowReleaseModal] = useState(false);

  const setActive = () => {
    setActiveCreature(ownedId);
    navigation.goBack();
    navigation.navigate('Tasks');
  }
  
  if (!creature) {
    return (
      <View style={styles.container}>
        <Text>Creature not found</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={creature.image} style={styles.image} />
      </View>
      
      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.name}>{creature.name}</Text>
        <Text style={styles.level}>Level {creature.level}</Text>
        
        <XPBar 
          currentXP={creature.currentXP} 
          xpToNextLevel={creature.xpToNextLevel} 
          style={styles.xpBar}
        />
        
        <Text style={styles.description}>{creature.description}</Text>

        <TouchableOpacity 
          style={[styles.button, styles.createButton, selectedCreature === creature.ownedId && styles.disabledButton]}
          onPress={setActive}
          disabled={selectedCreature === creature.ownedId}
        >
          <Text style={styles.buttonText}>Switch to Active</Text>
        </TouchableOpacity>

        {/* New: Release Creature Button */}
        <TouchableOpacity
          style={[styles.button, styles.releaseButton, (creature.ownedId === selectedCreature || ownedCreatures.length === 1) && styles.disabledButton]}
          onPress={() => setShowReleaseModal(true)}
          disabled={creature.ownedId === selectedCreature || ownedCreatures.length === 1}
        >
          <Text style={styles.buttonText}>Release Creature</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      {/* New: Release Confirmation Modal */}
      {showReleaseModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>You are about to release {creature.name}. Are you sure? This decision cannot be reversed.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                onPress={() => { 
                  releaseCreature(creature.ownedId); 
                  navigation.goBack(); 
                  setShowReleaseModal(false); 
                }} 
                style={[styles.modalButton, styles.yesButton]}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setShowReleaseModal(false)} 
                style={[styles.modalButton, styles.noButton]}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80, // Extra space for the fixed button
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  level: {
    fontSize: 20,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  xpBar: {
    marginVertical: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
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
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  releaseButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  // New styles for modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  // modalButtons: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  // },
  // modalButton: {
  //   padding: 10,
  //   backgroundColor: '#4CAF50',
  //   borderRadius: 5,
  //   marginHorizontal: 5,
  // },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noButton: {
    backgroundColor: '#CCCCCC',
  },
  yesButton: {
    backgroundColor: '#F44336',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
});

export default CreatureDetailScreen;