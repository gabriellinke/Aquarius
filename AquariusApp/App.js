/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import BaseTabNavigator from './src/navigation/FooterNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  waterLevelNotification,
  phSolutionLevelNotification,
} from './src/services/notification';

const RootStack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    async function verifyFirstSection() {
      const userHaveAccessed = await AsyncStorage.getItem('have-accessed');
      // await AsyncStorage.clear();
      if (!userHaveAccessed) {
        console.log('First Access');
        waterLevelNotification();
        phSolutionLevelNotification();
        await AsyncStorage.setItem('have-accessed', '1');
      }
    }
    verifyFirstSection();
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home">
        <RootStack.Screen
          name="Home"
          component={BaseTabNavigator}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
