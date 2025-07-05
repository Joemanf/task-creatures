import React, { useContext, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import XPBar from '../components/XPBar';

const CreatureDetailScreen = ({ route, navigation }) => {
  const { ownedCreatures, selectedCreature, setActiveCreature, releaseCreature } = useAppContext();
  const { ownedId } = route.params;
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showCoinReward, setShowCoinReward] = useState(false);
  const [coinAnimation] = useState(new Animated.Value(0));
  
  const creature = ownedCreatures.find(c => c.ownedId === ownedId);

  const setActive = () => {
    setActiveCreature(ownedId);
    navigation.goBack();
    navigation.navigate('Tasks');
  }

  const handleRelease = () => {
    const success = releaseCreature(ownedId);
    if (success) {
      setShowReleaseModal(false);
      showCoinRewardAnimation();
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    }
  };

  const showCoinRewardAnimation = () => {
    setShowCoinReward(true);
    coinAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(coinAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1400),
      Animated.timing(coinAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowCoinReward(false);
    });
  };

  const canRelease = selectedCreature !== creature?.ownedId && ownedCreatures.length > 1;
  
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
      {showCoinReward && (
        <Animated.View 
          style={[
            styles.coinReward,
            {
              opacity: coinAnimation,
              transform: [{
                translateY: coinAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }
          ]}
        >
          <Text style={styles.coinIcon}>🪙</Text>
          <Text style={styles.coinText}>+1</Text>
        </Animated.View>
      )}

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

        <TouchableOpacity 
          style={[styles.button, styles.releaseButton, !canRelease && styles.disabledButton]}
          onPress={() => setShowReleaseModal(true)}
          disabled={!canRelease}
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

      <Modal
        visible={showReleaseModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowReleaseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Release Creature</Text>
            <Text style={styles.modalText}>
              You are about to release {creature.name}. Are you sure? This decision cannot be reversed.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.noButton]}
                onPress={() => setShowReleaseModal(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.yesButton]}
                onPress={handleRelease}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  releaseButton: {
    backgroundColor: '#F44336',
    marginTop: 10,
  },
  coinReward: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  coinIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  coinText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  noButton: {
    backgroundColor: '#CCCCCC',
  },
  yesButton: {
    backgroundColor: '#F44336',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CreatureDetailScreen;