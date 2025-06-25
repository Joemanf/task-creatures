import React, { useContext, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import XPBar from '../components/XPBar';

const CreatureDetailScreen = ({ route, navigation }) => {
  const { ownedCreatures, selectedCreature, setActiveCreature, evolveCreature, coins, creatureTemplates } = useAppContext();
  const { ownedId } = route.params;
  
  const creature = ownedCreatures.find(c => c.ownedId === ownedId);
  
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

  const handleEvolve = (newTemplateId) => {
    const newTemplate = creatureTemplates.find(c => c.id === newTemplateId);
    if (!newTemplate) return;
    
    Alert.alert(
      'Evolve Creature',
      `Grow ${creature.name} into ${newTemplate.name}?`,
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            evolveCreature(ownedId, newTemplateId);
            // Navigate to evolution reveal screen
            navigation.navigate('EvolutionReveal', { creature: { ...newTemplate, ownedId } });
          }
        }
      ]
    );
  };

  const renderEvolutionOption = (option) => {
    const newTemplate = creatureTemplates.find(c => c.id === option.id);
    if (!newTemplate) return null;
    
    const levelMet = creature.level >= option.requiredLevel;
    const coinsMet = coins >= option.coinCost;
    const canEvolve = levelMet && coinsMet;
    
    return (
      <TouchableOpacity 
        key={option.id}
        style={[styles.evolveButton, !canEvolve && styles.disabledButton]}
        onPress={() => canEvolve && handleEvolve(option.id)}
        disabled={!canEvolve}
      >
        <View style={styles.evolveLeft}>
          <Image source={newTemplate.image} style={styles.evolveImage} />
          <Text style={styles.evolveText}>GROW</Text>
        </View>
        <View style={styles.evolveRight}>
          <View style={styles.requirement}>
            <Text style={styles.requirementLabel}>LVL</Text>
            <Text style={[styles.requirementValue, !levelMet && styles.requirementUnmet]}>
              {option.requiredLevel}
            </Text>
          </View>
          <View style={styles.requirement}>
            <Text style={styles.requirementLabel}>💰</Text>
            <Text style={[styles.requirementValue, !coinsMet && styles.requirementUnmet]}>
              {option.coinCost}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
      
        {creature.growsTo && creature.growsTo.length > 0 && (
          <View style={styles.evolutionSection}>
            <Text style={styles.sectionTitle}>Evolution Options</Text>
            {creature.growsTo.map(renderEvolutionOption)}
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
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  evolveButton: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  evolveLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32', // Darker green
    padding: 10,
  },
  evolveImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  evolveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  evolveRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Lighter green
    padding: 10,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementLabel: {
    marginRight: 5,
    fontWeight: 'bold',
    color: 'white',
  },
  requirementValue: {
    color: 'white',
    fontWeight: 'bold',
  },
  requirementUnmet: {
    color: '#F44336',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default CreatureDetailScreen;