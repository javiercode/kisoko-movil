import React, { useEffect, useState } from "react"
import {  FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from "react-native"
import {
  Text
} from "react-native"
import { ActivityIndicator, Avatar, Card, Divider, IconButton, Paragraph } from "react-native-paper"
import { formatDate, formatDateTime } from "../../utils/GeneralUtils"
import { getService, postService } from "../../utils/HttpService"
import { MessageResponse } from "../../utils/interfaces/IGeneral"
import { IResultJornada, JornadaTipoEnum } from "../../utils/interfaces/IJornada"
import Color from "../../utils/styles/Color"
import { Alert } from "react-native"
import { getPosition, hasLocationPermission } from "../../utils/MapUtils"

import BackgroundFetch from "react-native-background-fetch";
import { event } from "react-native-reanimated"
import { Colors, Header } from "react-native/Libraries/NewAppScreen"


export interface IEvents {
  taskId: any,
  timestamp: any
}
function Tarea() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<IEvents[]>([]);
 
  useEffect(() => {
    // getPosition()
    initBackgroundFetch()
  }, []);

  const initBackgroundFetch = async () => {
    // BackgroundFetch event handler.
    const onEvent = async (taskId:any) => {
      console.log('[BackgroundFetch] task: ', taskId);
      // Do your background work...
      
      await addEvent(taskId);
      // IMPORTANT:  You must signal to the OS that your task is complete.
      BackgroundFetch.finish(taskId);
    }

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
    const onTimeout = async (taskId:any) => {
      console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
      BackgroundFetch.finish(taskId);
    }

    // Initialize BackgroundFetch only once when component mounts.
    let status = await BackgroundFetch.configure({minimumFetchInterval: 15}, onEvent, onTimeout);

    console.log('[BackgroundFetch] configure status: ', status);
  }

  // Add a BackgroundFetch event to <FlatList>
  function addEvent(taskId: any) {
    // Simulate a possibly long-running asynchronous task with a Promise.
    return new Promise((resolve, reject) => {
      
      const tEvents = events;
      tEvents.push({
        taskId: taskId,
        timestamp: (new Date()).toString()
      });
      setEvents(tEvents);
      resolve(tEvents)
    });
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />

            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>BackgroundFetch Demo</Text>
              </View>
            </View>
          </ScrollView>
          <View style={styles.sectionContainer}>
            <FlatList
              data={events}
              renderItem={({item}) => (<Text>[{item.taskId}]: {item.timestamp}</Text>)}
              keyExtractor={item => item.timestamp}
            />
          </View>
        </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
});


export default Tarea