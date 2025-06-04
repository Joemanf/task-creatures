import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import DifficultySelector from '../components/DifficultySelector';

const CreateTaskScreen = ({ navigation }) => {
  const { createTask } = useAppContext();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState('easy');

  const handleCreate = () => {
    if (!title.trim()) return;
    
    createTask({
      title: title.trim(),
      notes: notes.trim(),
      difficulty,
    });
    
    navigation.navigate('Tasks');
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setNotes('');
    setDifficulty('easy');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create New Task</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Notes (optional)"
        multiline
        value={notes}
        onChangeText={setNotes}
      />
      
      <DifficultySelector onSelect={setDifficulty} initialValue={difficulty} />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            resetForm();
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.createButton]}
          onPress={handleCreate}
          disabled={!title.trim()}
        >
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateTaskScreen;