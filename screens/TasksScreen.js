import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import XPBar from '../components/XPBar';
import TaskItem from '../components/TaskItem';
import ConfirmationModal from '../components/ConfirmationModal';

const TasksScreen = () => {
  const { ownedCreatures, tasks, selectedCreature, completeTask } = useAppContext();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [levelUpCreature, setLevelUpCreature] = useState(null);

  const creature = ownedCreatures.find(c => c.ownedId === selectedCreature);

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleComplete = () => {
    const checkLevelUp = completeTask(selectedTask.id);
    setShowTaskModal(false);
    
    // Check for level up
    if (checkLevelUp) {
      setLevelUpCreature(creature);
    }
  };

  const activeTasks = tasks.filter(task => !task.completed);

  return (
    <View style={styles.container}>
      <View style={styles.creatureContainer}>
        <Text style={styles.levelText}>Lvl {creature.level}</Text>
        <Image source={creature.image} style={styles.creatureImage} />
        <XPBar currentXP={creature.currentXP} xpToNextLevel={creature.xpToNextLevel} />
      </View>

      <FlatList
        data={activeTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem task={item} onPress={() => handleTaskPress(item)} />
        )}
        contentContainerStyle={styles.listContent}
      />

      <Modal visible={showTaskModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedTask?.title}</Text>
            <Text style={styles.modalNotes}>{selectedTask?.notes}</Text>
            <Text style={styles.modalDifficulty}>
              Difficulty: {selectedTask?.difficulty}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.completeButton]}
                onPress={handleComplete}
              >
                <Text style={styles.buttonText}>Complete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setShowTaskModal(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmationModal
        visible={!!levelUpCreature}
        onConfirm={() => setLevelUpCreature(null)}
        title={`${levelUpCreature?.name} has just reached level ${levelUpCreature?.level+1}!`}
        confirmText="Awesome!"
        showCancel={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  creatureContainer: {
    height: '31%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  creatureImage: {
    // width: 250,
    // height: 250,
    width: '120%',
    height: '120%',
    resizeMode: 'contain',
    zIndex: 1,
    marginTop: 40,
  },
  levelText: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 18,
    fontWeight: 'bold',
    zIndex: 2,
  },
  listContent: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalNotes: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalDifficulty: {
    fontSize: 16,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  closeButton: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TasksScreen;