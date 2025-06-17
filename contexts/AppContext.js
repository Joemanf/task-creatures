import React, { createContext, useState, useContext } from 'react';
import { creatures as availableCreatures } from '../data/creatures';
import { initialTasks } from '../data/tasks';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // All of these should be grabbed from the backend eventually
  const [availableCreatures, setAvailableCreatures] = useState(availableCreatures);
  const [ownedCreatures, setOwnedCreatures] = useState([
    // Start with one creature
    {
      id: Date.now(),
      creatureId: 1,
      level: 1,
      currentXP: 0,
      xpToNextLevel: 10,
      levelUp: false
    }
  ]);
  const [tasks, setTasks] = useState(initialTasks);
  const [coins, setCoins] = useState(50); // Start with some coins for testing
  const [selectedCreature, setSelectedCreature] = useState(null);

  const addXP = (ownedCreatureId, xp) => {
    setOwnedCreatures(prevCreatures => {
      return prevCreatures.map(creature => {
        if (creature.id === ownedCreatureId) {
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
    let creature = ownedCreatures.find(c => c.id === selectedCreature);
    if (creature) {
      addXP(selectedCreature, xp);
    }
    
    // Mark task as completed
    setTasks(prevTasks => prevTasks.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    ));
    // Check for level up
    if (creature && xp + creature.currentXP >= creature.xpToNextLevel) {
      setCoins(coins+1)
      return true
    }
  }

  const generateRandomCreatures = () => {
    const rarityRolls = [
      { rarity: 'common', chance: 74 },
      { rarity: 'uncommon', chance: 20 },
      { rarity: 'rare', chance: 5 },
      { rarity: 'epic', chance: 1 }
    ];

    const rollRarity = () => {
      const roll = Math.random() * 100;
      let cumulative = 0;
      for (const { rarity, chance } of rarityRolls) {
        cumulative += chance;
        if (roll <= cumulative) return rarity;
      }
      return 'common'; // fallback
    };

    const getRandomCreatureByRarity = (rarity) => {
      const creaturesOfRarity = availableCreatures.filter(c => c.rarity === rarity);
      return creaturesOfRarity[Math.floor(Math.random() * creaturesOfRarity.length)];
    };

    return Array.from({ length: 3 }, () => {
      const rarity = rollRarity();
      return getRandomCreatureByRarity(rarity);
    });
  };

  const unlockCreature = (creatureId) => {
    if (coins < 10) return false;
    
    const baseCreature = availableCreatures.find(c => c.id === creatureId);
    if (!baseCreature) return false;
    
    setCoins(coins - 10);
    
    const newOwnedCreature = {
      id: Date.now() + Math.random(), // Ensure unique ID
      creatureId: baseCreature.id,
      level: 1,
      currentXP: 0,
      xpToNextLevel: 10,
      levelUp: false
    };
    
    setOwnedCreatures(prev => [...prev, newOwnedCreature]);
    return true;
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
        availableCreatures,
        ownedCreatures,
        tasks,
        coins,
        selectedCreature,
        setSelectedCreature,
        completeTask,
        unlockCreature,
        generateRandomCreatures,
        createTask
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);