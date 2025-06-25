import React, { createContext, useState, useContext } from 'react';
import { creatures } from '../data/creatures';  // Renamed for clarity as templates
import { initialTasks } from '../data/tasks';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // All of these should be grabbed from the backend eventually
  const [creatureTemplates, setCreatureTemplates] = useState(creatures);  // Renamed: Static list of creature templates
  const [ownedCreatures, setOwnedCreatures] = useState([  // New state: User's owned creatures, supporting duplicates
    {
      ...creatureTemplates[0],  // Copy from template
      ownedId: 1,  // Unique ID for this owned instance
      unlocked: true  // All owned are unlocked
    }
  ]);
  const [tasks, setTasks] = useState(initialTasks);
  const [coins, setCoins] = useState(10);
  const [selectedCreature, setSelectedCreature] = useState(1);  // Updated: Now references ownedId (starts with first owned)

  const addXP = (ownedId, xp) => {  // Updated: Use ownedId instead of template ID
    setOwnedCreatures(prevOwned => {
      return prevOwned.map(creature => {
        if (creature.ownedId === ownedId) {
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
            currentXP: newXP >= xpToNextLevel ? newXP - oldXP : newXP,
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
    // ... existing code ... (unchanged, except below)
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const xpValues = { easy: 1, medium: 2, hard: 3 };
    const xp = xpValues[task.difficulty];
    
    // Updated: Find by ownedId and add XP to owned creature
    const creature = ownedCreatures.find(c => c.ownedId === selectedCreature);
    if (creature) {
      addXP(selectedCreature, xp);  // Use ownedId
    }
    
    // Mark task as completed
    setTasks(prevTasks => prevTasks.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    ));
    
    // Check for level up (updated to use owned creature)
    if (creature && xp + creature.currentXP >= creature.xpToNextLevel) {
      setCoins(coins + 1);
      return true;
    }
  };

  // New: Function to get random creature templates based on rarity probabilities
  const getRandomCreatureOptions = (count = 3) => {
    const getRarity = () => {
      const rand = Math.random();
      if (rand < 0.01) return 'epic';      // 1%
      if (rand < 0.06) return 'rare';      // 5% (cumulative: 0.01 to 0.06)
      if (rand < 0.26) return 'uncommon';  // 20% (cumulative: 0.06 to 0.26)
      return 'common';                     // 74%
    };

    const options = [];
    for (let i = 0; i < count; i++) {
      const rarity = getRarity();
      let candidates = creatureTemplates.filter(c => (c.rarity === rarity) && c.canPurchase);
      if (candidates.length === 0) {
        candidates = creatureTemplates.filter(c => (c.rarity === 'common') && c.canPurchase);  // Fallback
      }
      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      if (selected) options.push(selected);
    }
    return options;
  };

  // New: Function to unlock a new creature instance from a template
  const unlockNewCreature = (templateId) => {
    const template = creatureTemplates.find(c => c.id === templateId);
    if (!template || coins < 10){
      console.log('Error: Not enough coins!')
      return
    } 
    
    setCoins(coins - 10);
    setOwnedCreatures(prevOwned => [
      ...prevOwned,
      {
        ...template,  // Copy template data
        ownedId: Date.now(),  // Unique ID for this instance
        level: 1,             // Reset to starting level
        currentXP: 0,
        xpToNextLevel: 10,
        unlocked: true
      }
    ]);
  };

  const setActiveCreature = (oId) => {
    setSelectedCreature(oId);
    const tempCreatures = []
    for (let i = 0; i < ownedCreatures.length; i++) {
      if (ownedCreatures[i].ownedId === oId) {
        tempCreatures.unshift(ownedCreatures[i])
      } else {
        tempCreatures.push(ownedCreatures[i])
      }
    }
    setOwnedCreatures(tempCreatures)
  }

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

  const evolveCreature = (ownedId, newTemplateId, coinCost) => {
    const ownedCreature = ownedCreatures.find(c => c.ownedId === ownedId);
    const newTemplate = creatureTemplates.find(c => c.id === newTemplateId);
    
    if (!ownedCreature || !newTemplate || coins < coinCost) {
      return false;
    }

    setCoins(coins - coinCost);
    
    setOwnedCreatures(prevOwned => {
      return prevOwned.map(creature => {
        if (creature.ownedId === ownedId) {
          return {
            ...newTemplate,
            ownedId: creature.ownedId, // Keep the same owned ID
            level: creature.level, // Retain level
            currentXP: creature.currentXP, // Retain XP
            xpToNextLevel: creature.xpToNextLevel, // Retain XP progress
            unlocked: true
          };
        }
        return creature;
      });
    });

    return true;
  };

  return (
    <AppContext.Provider
      value={{
        creatureTemplates,  // Expose templates if needed elsewhere
        ownedCreatures,     // New: Expose owned creatures
        tasks,
        coins,
        selectedCreature,   // Updated: ownedId
        setSelectedCreature,
        completeTask,
        unlockNewCreature,  // New
        setActiveCreature,
        getRandomCreatureOptions,  // New
        createTask,
        evolveCreature
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);