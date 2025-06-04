import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TaskItem = ({ task, onPress }) => {
  const getDifficultyColor = () => {
    switch (task.difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FFC107';
      case 'hard':
        return '#F44336';
      default:
        return '#4CAF50';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.difficultyIndicator} backgroundColor={getDifficultyColor()} />
      <Text style={styles.title}>{task.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  difficultyIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    flex: 1,
  },
});

export default TaskItem;