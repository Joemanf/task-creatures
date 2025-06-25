import React, { useContext, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { Ionicons } from '@expo/vector-icons';
import XPBar from '../components/XPBar';
import EvolutionSuccessScreen from '../components/EvolutionSuccessScreen';

const CreatureDetailScreen = ({ route, navigation }) => {
  const { ownedCreatures, selectedCreature, setActiveCreature, creatureTemplates, coins, evolveCreature } = useAppContext();
  const { ownedId } = route.params;
  const [showEvolutionSuccess, setShowEvolutionSuccess] = useState(false);
  const [evolvedCreature, setEvolvedCreature] = useState(null);
  
  const creature = ownedCreatures.find(c => c.ownedId === ownedId);
  const creatureTemplate = creatureTemplates.find(t => t.id === creature?.id);

  const setActive = () => {
    setActiveCreature(ownedId);
    navigation.goBack();
    navigation.navigate('Tasks');
  }

  const handleEvolution = (evolutionOption) => {
    const newTemplate = creatureTemplates.find(t => t.id === evolutionOption.id);
    
    Alert.alert(
      "Evolve Creature",
      `Grow ${creature.name} into ${newTemplate.name}?`,
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          onPress: () => {
            const success = evolveCreature(ownedId, evolutionOption.id, evolutionOption.coinCost);
            if (success) {
              setEvolvedCreature(newTemplate);
              setShowEvolutionSuccess(true);
            }
          }
        }
      ]
    );
  };

  const handleEvolutionSuccessClose = () => {
    setShowEvolutionSuccess(false);
    setEvolvedCreature(null);
    navigation.goBack();
  };
  
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

  const evolutionOptions = creatureTemplate?.evolutions || [];

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

        {/* Evolution Options */}
        {evolutionOptions.length > 0 && (
          <View style={styles.evolutionSection}>
            <Text style={styles.evolutionTitle}>Evolution Options:</Text>
            {evolutionOptions.map((evolution) => {
              const evolutionTemplate = creatureTemplates.find(t => t.id === evolution.id);
              const canEvolveLevel = creature.level >= evolution.requiredLevel;
              const canEvolveCoins = coins >= evolution.coinCost;
              const canEvolve = canEvolveLevel && canEvolveCoins;

              return (
                <TouchableOpacity
                  key={evolution.id}
                  style={[styles.evolutionButton, !canEvolve && styles.disabledEvolutionButton]}
                  onPress={() => canEvolve && handleEvolution(evolution)}
                  disabled={!canEvolve}
                >
                  <View style={styles.evolutionLeft}>
                    <Image source={evolutionTemplate.image} style={styles.evolutionImage} />
                    <Text style={styles.growText}>GROW</Text>
                  </View>
                  <View style={styles.evolutionRight}>
                    <View style={styles.requirementRow}>
                      <Text style={styles.requirementLabel}>LVL</Text>
                      <Text style={[styles.requirementValue, !canEvolveLevel && styles.requirementNotMet]}>
                        {evolution.requiredLevel}
                      </Text>
                    </View>
                    <View style={styles.requirementRow}>
                      <Ionicons name="diamond" size={16} color={canEvolveCoins ? "#333" : "#ff0000"} />
                      <Text style={[styles.requirementValue, !canEvolveCoins && styles.requirementNotMet]}>
                        {evolution.coinCost}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity 
          style={[styles.button, styles.createButton, selectedCreature === creature.ownedId && styles.disabledButton]}
          onPress={setActive}
          disabled={selectedCreature === creature.ownedId}
        >
          <Text style={styles.buttonText}>Switch to Active</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <EvolutionSuccessScreen
        visible={showEvolutionSuccess}
        creature={evolvedCreature}
        onClose={handleEvolutionSuccessClose}
      />
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
  evolutionSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  evolutionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  evolutionButton: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  disabledEvolutionButton: {
    opacity: 0.6,
  },
  evolutionLeft: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    flex: 1,
  },
  evolutionRight: {
    backgroundColor: '#4CAF50',
    padding: 15,
    justifyContent: 'center',
    minWidth: 210,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  evolutionImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  growText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  requirementLabel: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 14,
  },
  requirementValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
  requirementNotMet: {
    color: '#ff0000',
  },
});

export default CreatureDetailScreen;