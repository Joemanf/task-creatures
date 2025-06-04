import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const DifficultySelector = ({ onSelect, initialValue = 'easy' }) => {
  const handleSelect = (difficulty) => {
    onSelect(difficulty);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Difficulty:</Text>
      <View style={styles.buttonsContainer}>
        {['easy', 'medium', 'hard'].map((difficulty) => (
          <TouchableOpacity
            key={difficulty}
            style={[
              styles.button,
              initialValue === difficulty && styles.selectedButton,
            ]}
            onPress={() => handleSelect(difficulty)}
          >
            <Text
              style={[
                styles.buttonText,
                initialValue === difficulty && styles.selectedButtonText,
              ]}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  buttonText: {
    color: '#333333',
  },
  selectedButtonText: {
    color: 'white',
  },
});

export default DifficultySelector;