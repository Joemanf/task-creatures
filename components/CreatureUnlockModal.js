import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, ActivityIndicator } from 'react-native';

const CreatureUnlockModal = ({ 
  visible, 
  onClose, 
  onSelectCreature,
  creatures,
  coins
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleSelectCreature = (creature) => {
    onSelectCreature(creature);
    onClose();
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#9E9E9E';
      case 'uncommon': return '#4CAF50';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      default: return '#9E9E9E';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Choose a Creature to Unlock</Text>
          <Text style={styles.costText}>Cost: 10 coins</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Rolling for creatures...</Text>
            </View>
          ) : (
            <View style={styles.creaturesContainer}>
              {creatures.map((creature, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.creatureOption,
                    { borderColor: getRarityColor(creature.rarity) },
                    coins < 10 && styles.disabledOption
                  ]}
                  onPress={() => handleSelectCreature(creature)}
                  disabled={coins < 10}
                >
                  <Image source={creature.image} style={styles.creatureImage} />
                  <Text style={styles.creatureName}>{creature.name}</Text>
                  <Text style={[styles.rarityText, { color: getRarityColor(creature.rarity) }]}>
                    {creature.rarity.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  costText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  creaturesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  creatureOption: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    width: '30%',
  },
  disabledOption: {
    opacity: 0.5,
  },
  creatureImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  creatureName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CreatureUnlockModal;