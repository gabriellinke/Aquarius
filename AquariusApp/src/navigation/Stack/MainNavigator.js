import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../../screens/Home';
import Settings from '../../screens/Settings';
import UserConfiguration from '../../screens/UserConfiguration';

const Stack = createNativeStackNavigator();

function MainNavigator({screenName}) {
  return (
    // Navegação em pilha pelas telas
    <Stack.Navigator
      initialRouteName={screenName}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="UserConfiguration" component={UserConfiguration} />
    </Stack.Navigator>
  );
}

export default MainNavigator;
