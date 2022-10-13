import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../../screens/Home';
import Configuration from '../../screens/Configuration';

const Stack = createNativeStackNavigator();

function MainNavigator() {
  return (
    // Navegação em pilha pelas telas
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Configuration" component={Configuration} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;
