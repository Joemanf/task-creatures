import React, { useState, useContext } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';  // Added TouchableOpacity for button
import { useAppContext } from '../contexts/AppContext';
import CreatureCard from '../components/CreatureCard';
import CreatureSelectionModal from '../components/CreatureSelectionModal';  // New import for modal

const CreaturesScreen = ({ navigation }) => {
  const { ownedCreatures, coins, unlockNewCreature, getRandomCreatureOptions } = useAppContext();  // Updated: Use ownedCreatures and new functions
  const [showUnlockModal, setShowUnlockModal] = useState(false);  // New: For new unlock modal
  const [creatureOptions, setCreatureOptions] = useState([]);    // New: Holds 3 random options

  // Updated: Only handle owned creatures (no unlock logic needed here)
  const handleCreaturePress = (creature) => {
    navigation.navigate('CreatureDetail', { ownedId: creature.ownedId });  // Updated: Pass ownedId
  };

  // New: Handle unlock button press
  const handleUnlockPress = () => {
    if (coins >= 10) {
      const options = getRandomCreatureOptions();
      setCreatureOptions(options);
      setShowUnlockModal(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.coins}>Coins: {coins}</Text>
      
      {/* New: Unlock button */}
      <TouchableOpacity
        style={[styles.unlockButton, coins < 10 && styles.disabledButton]}
        onPress={handleUnlockPress}
        disabled={coins < 10}
      >
        <Text style={styles.unlockButtonText}>Unlock New Creature (10 coins)</Text>
      </TouchableOpacity>
      
      {ownedCreatures.length === 0 ? (  // New: Placeholder if no owned creatures
        <Text style={styles.noCreatures}>You don't own any creatures yet. Unlock some!</Text>
      ) : (
        <FlatList
          data={ownedCreatures}  // Updated: Use ownedCreatures
          keyExtractor={(item) => item.ownedId.toString()}  // Updated: Use ownedId
          numColumns={3}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <CreatureCard 
              creature={item}  // Passes owned creature data
              onPress={() => handleCreaturePress(item)} 
            />
          )}
        />
      )}
      
      {/* New: Creature selection modal */}
      <CreatureSelectionModal
        visible={showUnlockModal}
        creatureOptions={creatureOptions}
        onSelect={(templateId) => {
          unlockNewCreature(templateId);
          setShowUnlockModal(false);
        }}
        onClose={() => setShowUnlockModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  coins: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  listContent: {
    alignItems: 'center',
  },
  unlockButton: {  // New styles for button
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  unlockButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  noCreatures: {  // New style for placeholder
    textAlign: 'center',
    fontSize: 16,
    margin: 20,
    color: '#666',
  },
});

export default CreaturesScreen;