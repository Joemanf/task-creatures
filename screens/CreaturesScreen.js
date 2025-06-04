import React, { useState, useContext } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import CreatureCard from '../components/CreatureCard';
import ConfirmationModal from '../components/ConfirmationModal';

const CreaturesScreen = ({ navigation }) => {
  const { creatures, coins, unlockCreature } = useAppContext();
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const handleCreaturePress = (creature) => {
    if (creature.unlocked) {
      navigation.navigate('CreatureDetail', { creatureId: creature.id });
    } else {
      setSelectedCreature(creature);
      setShowUnlockModal(true);
    }
  };

  const handleUnlock = () => {
    if (selectedCreature) {
      unlockCreature(selectedCreature.id);
      setShowUnlockModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.coins}>Coins: {coins}</Text>
      
      <FlatList
        data={creatures}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CreatureCard 
            creature={item} 
            onPress={() => handleCreaturePress(item)} 
          />
        )}
      />
      
      <ConfirmationModal
        visible={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onConfirm={handleUnlock}
        title={`Unlock ${selectedCreature?.name}?`}
        confirmText={`Unlock (10 coins)`}
        confirmDisabled={coins < 10}
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
});

export default CreaturesScreen;