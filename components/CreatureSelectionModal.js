import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import CreatureCard from './CreatureCard';

const CreatureSelectionModal = ({ visible, creatureOptions, onConfirm, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState('');
  const [selectedVis, setSelectedVis] = useState('');

  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);  // Simulate 1.5s loading
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  function onSelect(id, vid) {
    setSelected(id);
    setSelectedVis(vid);
  };

  function confirmPress() {
    if (selected) {
      onConfirm(selected);
      setSelected('');
      setSelectedVis('');
    }
  }

  function closeAndClear() {
    setSelected('');
    setSelectedVis('');
    onClose();
  }

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
                  keyExtractor={(item) => item.selectId.toString()}
                  horizontal
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      onPress={() => {}}
                      style={selectedVis === item.selectId ? styles.outline : ''}
                    >
                      <CreatureCard creature={item} onPress={() => {onSelect(item.id, item.selectId)}} />
                    </TouchableOpacity>
                  )}
                  style={styles.list}
                />
              )}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={selected ? styles.createButton : styles.closeButton} onPress={confirmPress}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={closeAndClear}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
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
  outline: {
    borderWidth: 2,
    borderColor: '#c0e63aff',
  },
  list: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '55%'
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
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