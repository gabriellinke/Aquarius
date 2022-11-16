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
import {displayNotification} from './src/services/notification';
import messaging from '@react-native-firebase/messaging';

const RootStack = createNativeStackNavigator();

// Register background handler
// Get the notification
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

async function onAppStart() {
  // Register the device with FCM
  await messaging().registerDeviceForRemoteMessages();
  await messaging().subscribeToTopic('aquarius');

  // Get the token
  const token = await messaging().getToken();
  console.log(token);
}

onAppStart();

export default function App() {
  // Mostra notificação se for recebido algo enquanto está em foreground
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      displayNotification(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        `${remoteMessage.sentTime}`,
      );
    });

    return unsubscribe;
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
