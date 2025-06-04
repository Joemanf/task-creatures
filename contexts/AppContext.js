import React, { createContext, useState, useContext } from 'react';
import { creatures as initialCreatures } from '../data/creatures';
import { initialTasks } from '../data/tasks';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // All of these should be grabbed from the backend eventually
  const [creatures, setCreatures] = useState(initialCreatures);
  const [tasks, setTasks] = useState(initialTasks);
  const [coins, setCoins] = useState(0);
  const [selectedCreature, setSelectedCreature] = useState(initialCreatures[0].id);

  const addXP = (creatureId, xp) => {
    setCreatures(prevCreatures => {
      return prevCreatures.map(creature => {
        if (creature.id === creatureId) {
          const newXP = creature.currentXP + xp;
          let newLevel = creature.level;
          let xpToNextLevel = creature.xpToNextLevel;
          let oldXP = xpToNextLevel;
          let levelUp = false;
          
          if (newXP >= xpToNextLevel) {
            newLevel += 1;
            xpToNextLevel = Math.floor(xpToNextLevel * 1); // was * 1.5
            levelUp = true;
          }
          
          return {
            ...creature,
            currentXP: newXP >= xpToNextLevel ? newXP - oldXP : newXP, // Old code: newXP >= xpToNextLevel ? 0 : newXP,
            level: newLevel,
            xpToNextLevel,
            levelUp
          };
        }
        return creature;
      });
    });
  };

  const completeTask = (taskId) => {
    // Find the task and get its XP value
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const xpValues = { easy: 1, medium: 2, hard: 3 };
    const xp = xpValues[task.difficulty];
    
    // Add XP to the selected creature
    let creature = creatures.find(c => c.id === selectedCreature);
    addXP(selectedCreature, xp);
    
    // Mark task as completed
    setTasks(prevTasks => prevTasks.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    ));
    // Check for level up
    if (xp + creature.currentXP >= creature.xpToNextLevel) {
      setCoins(coins+1)
      return true
    }
  };

  const unlockCreature = (creatureId) => {
    const creature = creatures.find(c => c.id === creatureId);
    if (!creature || coins < 10) return;
    
    setCoins(coins - 10);
    setCreatures(prevCreatures => prevCreatures.map(c => 
      c.id === creatureId ? { ...c, unlocked: true } : c
    ));
  };

  const createTask = (newTask) => {
    setTasks(prevTasks => [
      ...prevTasks,
      {
        ...newTask,
        id: Date.now(), // Simple ID generation - fix this
        completed: false
      }
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        creatures,
        tasks,
        coins,
        selectedCreature,
        setSelectedCreature,
        completeTask,
        unlockCreature,
        createTask
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);