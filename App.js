import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './contexts/AppContext';
import MainTabNavigator from './AppNavigator';

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <MainTabNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}