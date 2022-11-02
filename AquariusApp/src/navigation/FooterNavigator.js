import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from '../assets/home_outlined.png';
import HomeFocus from '../assets/home_filled.png';
import Settings from '../assets/settings_outlined.png';
import SettingsFocus from '../assets/settings_filled.png';
import User from '../assets/user_outlined.png';
import UserFocus from '../assets/user_filled.png';
import MainNavigator from './Stack/MainNavigator';

import {TouchableOpacity} from 'react-native-gesture-handler'; // Fixes bug with react-native_TouchableOpacity <-> react-navigation

const Footer = createBottomTabNavigator();

export default function BaseTabNavigator() {
  return (
    <Footer.Navigator
      initialRouteName="HomeBottomTab"
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
        showLabel: false,
        headerShown: false,
      }}>
      <Footer.Screen
        name="HomeBottomTab"
        children={() => {
          return <MainNavigator screenName="Home" />;
        }} //HomeNavigator
        options={{
          tabBarAccessibilityLabel: 'Início',
          tabBarIcon: ({color, size, focused}) => {
            return (
              <View
                style={styles.tabBarIconContainer}
                importantForAccessibility={'no-hide-descendants'}>
                <TouchableOpacity>
                  {focused ? (
                    <Image source={HomeFocus} />
                  ) : (
                    <Image source={Home} />
                  )}
                </TouchableOpacity>
                <Text
                  style={[
                    styles.labelStyle,
                    {color: '#000000', fontWeight: focused ? 'bold' : 'normal'},
                  ]}>
                  início
                </Text>
              </View>
            );
          },
        }}
      />
      <Footer.Screen
        name="SettingsBottomTab"
        children={() => {
          return <MainNavigator screenName="Settings" />;
        }}
        options={{
          tabBarAccessibilityLabel: 'Configurações',
          tabBarIcon: ({color, size, focused}) => {
            return (
              <View
                style={styles.tabBarIconContainer}
                importantForAccessibility={'no-hide-descendants'}>
                <TouchableOpacity>
                  {focused ? (
                    <Image source={SettingsFocus} />
                  ) : (
                    <Image source={Settings} />
                  )}
                </TouchableOpacity>
                <Text
                  style={[
                    styles.labelStyle,
                    {color: '#000000', fontWeight: focused ? 'bold' : 'normal'},
                  ]}>
                  configurações
                </Text>
              </View>
            );
          },
        }}
      />
      <Footer.Screen
        name="UserConfigBottomTab"
        children={() => {
          return <MainNavigator screenName="UserConfiguration" />;
        }}
        options={{
          tabBarAccessibilityLabel: 'Configurações do usuário',
          tabBarIcon: ({color, size, focused}) => {
            return (
              <View
                style={styles.tabBarIconContainer}
                importantForAccessibility={'no-hide-descendants'}>
                <TouchableOpacity>
                  {focused ? (
                    <Image source={UserFocus} />
                  ) : (
                    <Image source={User} />
                  )}
                </TouchableOpacity>
                <Text
                  style={[
                    styles.labelStyle,
                    {color: '#000000', fontWeight: focused ? 'bold' : 'normal'},
                  ]}>
                  usuário
                </Text>
              </View>
            );
          },
        }}
      />
    </Footer.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderTopColor: 'transparent',
    height: 72,
    position: 'absolute',
    bottom: 0,
  },
  labelStyle: {
    fontSize: 14,
    fontFamily: 'Roboto',
    lineHeight: 14,
    paddingTop: 8,
  },
  tabBarIconContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
