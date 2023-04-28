import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, Button, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView, ScrollView } from 'react-native';
import { DataTable, Text, Searchbar, Avatar, Card, IconButton, Title, Paragraph, BottomNavigation } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService } from '../../utils/HttpService';
import { IDataTarea } from '../../utils/interfaces/ITarea';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import ListPendientes from './ListPendientes';
import ListFinalizados from './ListFinalizados';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ListProceso from './ListProceso';

type Props = NativeStackScreenProps<any, MenuPathEnum.TAREA>;
const Tab = createBottomTabNavigator();
export default function Tarea({ route, navigation }: Props) {

  useEffect(() => {
    console.log("route.params",route.params)
    console.log("route.path",route.path)
    console.log("index tarea");
  }, []);

  return (
    <Tab.Navigator  >
      <Tab.Screen name="PENDIENTES"  component={ListPendientes} initialParams={{type:'A'}} options={{
        tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="clipboard-list-outline" color={Color.secondary} size={30} />),
        headerShown: false,
        tabBarLabelStyle:{fontSize:15,color:Color.secondary, fontWeight:'bold'},
        tabBarActiveBackgroundColor: Color.primaryVariant
      }} />
      <Tab.Screen name="EN PROCESO" component={ListProceso} initialParams={{type:'P'}} options={{
        tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="playlist-edit" color={Color.secondary} size={30}  />),
        headerShown: false,
        tabBarLabelStyle:{fontSize:15,color:Color.secondary, fontWeight:'bold'},
        tabBarActiveBackgroundColor: Color.primaryVariant
      }} />
      <Tab.Screen name="FINALIZADOS" component={ListFinalizados} initialParams={{type:'F'}} options={{
        tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="playlist-check" color={Color.secondary} size={30}  />),
        headerShown: false,
        tabBarLabelStyle:{fontSize:15,color:Color.secondary, fontWeight:'bold'},
        tabBarActiveBackgroundColor: Color.primaryVariant
      }} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 15,
    textAlign: 'center',
    alignItems: 'center',
    margin: 8,
    fontWeight: 'bold',
  },
  body: {
    color: "#F4F4F4",
    backgroundColor: "#F4F4F4",
    // backgroundColor: Color.white,
    borderRadius: 5,
    margin: 2
  },
  avatarIcon: {
    backgroundColor: Color.primary,
  },
})

