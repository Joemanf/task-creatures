import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import CreatureCard from '../components/CreatureCard';
import CreatureUnlockModal from '../components/CreatureUnlockModal';

const CreaturesScreen = ({ navigation }) => {
  const { 
    availableCreatures, 
    ownedCreatures, 
    coins, 
    unlockCreature, 
    generateRandomCreatures 
  } = useAppContext();
  
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [randomCreatures, setRandomCreatures] = useState([]);

  const handleUnlockPress = () => {
    const creatures = generateRandomCreatures();
    setRandomCreatures(creatures);
    setShowUnlockModal(true);
  };

  const handleSelectCreature = (creature) => {
    unlockCreature(creature.id);
  };

  const handleCreaturePress = (ownedCreature) => {
    navigation.navigate('CreatureDetail', { ownedCreatureId: ownedCreature.id });
  };

  const renderOwnedCreature = ({ item }) => {
    const baseCreature = availableCreatures.find(c => c.id === item.creatureId);
    if (!baseCreature) return null;

    const creatureWithLevel = {
      ...baseCreature,
      level: item.level,
      unlocked: true,
      ownedId: item.id
    };

    return (
      <CreatureCard 
        creature={creatureWithLevel} 
        onPress={() => handleCreaturePress(item)} 
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.coins}>Coins: {coins}</Text>
        <TouchableOpacity 
          style={[styles.unlockButton, coins < 10 && styles.disabledButton]}
          onPress={handleUnlockPress}
          disabled={coins < 10}
        >
          <Text style={styles.unlockButtonText}>Unlock New Creature</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Your Creatures</Text>
      
      <FlatList
        data={ownedCreatures}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        renderItem={renderOwnedCreature}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No creatures yet! Unlock your first creature above.</Text>
        }
      />
      
      <CreatureUnlockModal
        visible={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onSelectCreature={handleSelectCreature}
        creatures={randomCreatures}
        coins={coins}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  coins: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  unlockButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  unlockButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  listContent: {
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});

export default CreaturesScreen;