import React, { useContext, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import XPBar from '../components/XPBar';

const CreatureDetailScreen = ({ route, navigation }) => {
  const { ownedCreatures, selectedCreature, setActiveCreature, creatureTemplates, coins, evolveCreature } = useAppContext();
  const { ownedId } = route.params;
  
  const creature = ownedCreatures.find(c => c.ownedId === ownedId);
  const creatureTemplate = creatureTemplates.find(c => c.id === creature.id);

  const setActive = () => {
    setActiveCreature(ownedId);
    navigation.goBack();
    navigation.navigate('Tasks');
  }

  const handleEvolve = (evolutionOption) => {
    const targetTemplate = creatureTemplates.find(c => c.id === evolutionOption.targetId);
    
    Alert.alert(
      'Evolve Creature',
      `Grow ${creature.name} into ${targetTemplate.name}?`,
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            const evolvedCreature = evolveCreature(ownedId, evolutionOption);
            if (evolvedCreature) {
              // Navigate to evolution success screen
              navigation.navigate('EvolutionSuccess', { 
                evolvedCreature 
              });
            } else {
              Alert.alert('Requirements Not Met', 'You need to meet the level and coin requirements to evolve.');
            }
          }
        }
      ]
    );
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

        {/* New: Evolution Options */}
        {creatureTemplate?.growsTo?.length > 0 && (
          <View style={styles.evolutionContainer}>
            <Text style={styles.evolutionTitle}>Evolution Options:</Text>
            {creatureTemplate.growsTo.map((option, index) => {
              const targetTemplate = creatureTemplates.find(c => c.id === option.targetId);
              const levelMet = creature.level >= option.requiredLevel;
              const coinsMet = coins >= option.coinCost;
              
              return (
                <TouchableOpacity 
                  key={index}
                  style={styles.evolutionButton}
                  onPress={() => handleEvolve(option)}
                  disabled={!levelMet || !coinsMet}
                >
                  <View style={styles.evolutionButtonLeft}>
                    <Image source={targetTemplate.image} style={styles.evolutionImage} />
                    <Text style={styles.evolutionGrowText}>GROW</Text>
                  </View>
                  <View style={styles.evolutionButtonRight}>
                    <Text style={[
                      styles.evolutionRequirement,
                      !levelMet && styles.requirementNotMet
                    ]}>
                      LVL {option.requiredLevel}
                    </Text>
                    <View style={styles.coinRequirement}>
                      <Image 
                        source={require('../assets/coin-icon.png')} // Assuming you have a coin icon
                        style={styles.coinIcon} 
                      />
                      <Text style={[
                        styles.evolutionRequirement,
                        !coinsMet && styles.requirementNotMet
                      ]}>
                        {option.coinCost}
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
  evolutionContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  evolutionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  evolutionButton: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  evolutionButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388E3C', // Darker green
    padding: 10,
  },
  evolutionButtonRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Lighter green
    padding: 10,
  },
  evolutionImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  evolutionGrowText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  evolutionRequirement: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  coinRequirement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  requirementNotMet: {
    color: '#F44336', // Red for unmet requirements
  },
});

export default CreatureDetailScreen;