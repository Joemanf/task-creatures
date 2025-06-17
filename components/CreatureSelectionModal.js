import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import CreatureCard from './CreatureCard';

const CreatureSelectionModal = ({ visible, creatureOptions, onSelect, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);  // Simulate 1.5s loading
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Finding creatures...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.modalTitle}>Choose a Creature to Unlock</Text>
              {creatureOptions.length === 0 ? (
                <Text style={styles.errorText}>No creatures available. Try again!</Text>
              ) : (
                <FlatList
                  data={creatureOptions}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onSelect(item.id)}>
                      <CreatureCard creature={item} onPress={() => {}} />  {/* Reuse CreatureCard, disable internal press */}
                    </TouchableOpacity>
                  )}
                  style={styles.list}
                />
              )}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
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
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  list: {
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#9E9E9E',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default CreatureSelectionModal;