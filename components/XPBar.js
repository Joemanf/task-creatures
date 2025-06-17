import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const XPBar = ({ currentXP, xpToNextLevel }) => {
  const percentage = (currentXP / xpToNextLevel) * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.backgroundBar}>
        <View style={[styles.xpBar, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.xpText}>{currentXP}/{xpToNextLevel} XP</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // paddingVertical: -5,
    marginVertical: 5,
    zIndex: 2,
  },
  backgroundBar: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  xpBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  xpText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default XPBar;