import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import TasksScreen from './screens/TasksScreen';
import CreaturesScreen from './screens/CreaturesScreen';
import CreatureDetailScreen from './screens/CreatureDetailScreen';
import CreateTaskScreen from './screens/CreateTaskScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CreaturesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreaturesList" component={CreaturesScreen} />
      <Stack.Screen name="CreatureDetail" component={CreatureDetailScreen} />
    </Stack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Tasks') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Creatures') {
            iconName = focused ? 'paw' : 'paw-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen 
        name="CreateTask" 
        component={CreateTaskScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size + 10} color={color} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen name="Creatures" component={CreaturesStack} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;