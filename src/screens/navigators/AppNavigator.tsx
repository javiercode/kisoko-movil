import React, { useEffect, createContext, useState } from "react";
import { DeviceEventEmitter, Dimensions, View, Text, AsyncStorage, SafeAreaView, Modal, Pressable } from 'react-native'
import { DrawerActions, NavigationContainer, useFocusEffect } from "@react-navigation/native";
// import { createStackNavigator, } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createListenerMiddleware } from '@reduxjs/toolkit'
import { signInReducer, signOutReducer } from '../../store/login/reducer'

import PropTypes from 'prop-types'
import Screens from "../../utils/Screens";
import Utils from '../../utils/NumeralUtil'
import { getAuth, listenAuth, signOut } from "../../store/login";
import MenuSideBar from "./MenuSideBar";
import HeaderRight from "./HeaderRight";
import { INavigation } from "../../utils/interfaces/IGeneral";
import HeaderLeft from "./HeaderLeft";
import Settings from "../configuracion";
import Jornada from "../jornada";
import Cliente from "../cliente";
import Tarea from "../tarea";
import Background from "../background";
import CerrarJornada from "../jornada/CerrarJornada";
import Logout from "../session/Logout";
import Login from "../session/Login";
import ToAuthorized from "../session/ToAuthorized";
import { MenuPathEnum } from "../../utils/enums/Login.enum";
import { ReducerType } from "../../utils/interfaces/ILoginStore";
import ClienteDetalle from "../cliente/Detalle";
import ClienteCreate from "../cliente/Create";
import TareaDetalle from "../tarea/Detalle";
import TareaCreate from "../tarea/Create";
import TareaEdit from "../tarea/Edit";
import HeaderGo from "./HeaderGo";
import HeaderBack from "./HeaderBack";
import HeaderCreateCliente from "./HeaderCreateClient";
import Color from "../../utils/styles/Color";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";

const { width, height } = Dimensions.get("window");
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const AuthContext = createContext(null);
const styleHeader: NativeStackNavigationOptions = {
  statusBarColor: Color.secondary,
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontWeight: 'bold'
  },
};


const AppNavigator = (props: any) => {
  const [isLogin, setIsLogin] = useState(getAuth().isLogin)
  const [tokenValido, setTokenValido] = useState(true)

  useEffect(() => {
    listenersEvents()
  }, [isLogin])



  const listenersEvents = () => {
    DeviceEventEmitter.addListener(ReducerType.SIGN_IN, (seconds) => {
      setIsLogin(getAuth().isLogin);
    })

    DeviceEventEmitter.addListener(ReducerType.SIGN_OUT, () => {
      setIsLogin(false);
    })

    DeviceEventEmitter.addListener(ReducerType.TOKEN_VALID, () => {
      setTokenValido(true);
    })

    DeviceEventEmitter.addListener(ReducerType.TOKEN_INVALID, () => {
      setTokenValido(false);
    })

    // Create the middleware instance and methods
    // listenAuth()


  }

  const ClienteNavigation: React.FC<INavigation> = ({ navigation }) => {
    return (
      <Stack.Navigator initialRouteName={MenuPathEnum.CLIENTE}
        screenOptions={styleHeader} 
        // screenListeners={{
        //   state: (e) => {
        //     // Do something with the state
        //     console.info('state changed', e.data);
        //   },
        // }}
         >
        {/* <Stack.Group screenOptions={{ headerStyle: {} }}> */}
        
        <Stack.Screen options={{
          headerRight: () => (
            <HeaderGo navigation={navigation} url={MenuPathEnum.CLIENTE_CREATE} icon={"account-plus"} />
          ),
          headerLeft: () => (
            <HeaderLeft navigation={navigation} />
          ),
          title: 'Productos'
        }}
          name={MenuPathEnum.CLIENTE} component={Cliente} />

        <Stack.Screen options={{
          headerRight: () => (
            <HeaderGo navigation={navigation} url={MenuPathEnum.CLIENTE} icon={"format-list-text"} />
          ),
          headerLeft: () => (
            <HeaderLeft navigation={navigation} />
          ),
          title: 'Producto'
        }}
          name={MenuPathEnum.CLIENTE_DETAIL} component={ClienteDetalle} />

        <Stack.Screen options={{
          headerRight: () => (
            <HeaderGo navigation={navigation} url={MenuPathEnum.CLIENTE} icon={"format-list-text"} />
          ),
          headerLeft: () => (
            <HeaderLeft navigation={navigation} />
          ),
          title: 'Crear Producto'
        }}
          name={MenuPathEnum.CLIENTE_CREATE} component={ClienteCreate} />
        {/* </Stack.Group>

        <Stack.Group screenOptions={{ headerStyle: {} }}>
          <Stack.Screen
            options={{
              headerRight: () => (
                <HeaderRight />
              ),
            }}
            name={MenuPathEnum.JORNADA_HOME} component={CerrarJornada} />
        </Stack.Group> */}

      </Stack.Navigator>
    );
  }

  const SettingNavigation: React.FC<INavigation> = ({ navigation }) => {
    return (
      <Stack.Navigator initialRouteName={MenuPathEnum.SETTINGS}
        screenOptions={styleHeader} >
        <Stack.Screen options={{
          headerLeft: () => (
            <HeaderLeft navigation={navigation} />
          ),
          title: 'Configuraciones'
        }}
          name={MenuPathEnum.SETTINGS} component={Settings} />
      </Stack.Navigator>
    );
  }

  const JornadaNavigation: React.FC<INavigation> = ({ navigation }) => {
    return (
      <Stack.Navigator initialRouteName={MenuPathEnum.JORNADA}
        screenOptions={styleHeader} >
        <Stack.Screen options={{
          headerLeft: () => (
            <HeaderLeft navigation={navigation} />
          ),
          title: 'Mi Kiosko'
        }}
          name={MenuPathEnum.JORNADA} component={Jornada} />
      </Stack.Navigator>
    );
  }

  const TareaNavigation: React.FC<INavigation> = ({ navigation }) => {
    return (
      <Stack.Navigator initialRouteName={MenuPathEnum.TAREA}
        screenOptions={styleHeader}  >
        <Stack.Group screenOptions={{ headerStyle: {} }} >
          <Stack.Screen options={{
            headerRight: () => (
              <HeaderGo navigation={navigation} url={MenuPathEnum.TAREA_CREATE} icon={"account-plus"} />
            ),
            headerLeft: () => (
              <HeaderLeft navigation={navigation} />
            ),
            title: 'Movimientos'
          }}
            name={MenuPathEnum.TAREA} component={Tarea} />

        </Stack.Group>
        <Stack.Group screenOptions={{ headerStyle: {} }} >

          <Stack.Screen options={{
            headerRight: () => (
              <HeaderGo navigation={navigation} url={MenuPathEnum.TAREA} icon={"format-list-text"} />
            ),
            headerLeft: () => (
              <HeaderLeft navigation={navigation} />
            ),
            title: 'Comprar'
          }}
            name={MenuPathEnum.TAREA_CREATE} component={TareaCreate} />

          <Stack.Screen options={{
            headerRight: () => (
              <HeaderGo navigation={navigation} url={MenuPathEnum.TAREA} icon={"format-list-text"} />
            ),
            headerLeft: () => (
              <HeaderLeft navigation={navigation} />
            ),
            title: 'Compra'
          }}
            name={MenuPathEnum.TAREA_DETALLE} component={TareaDetalle} />

          <Stack.Screen options={{
            headerRight: () => (
              <HeaderBack navigation={navigation} icon={"clipboard-arrow-left"} />
            ),
            headerLeft: () => (
              <HeaderLeft navigation={navigation} />
            ),
            title: 'Editar Compra'
          }}
            name={MenuPathEnum.TAREA_EDIT} component={TareaEdit} />

        </Stack.Group>


      </Stack.Navigator>
    );
  }

  function Logout({ navigation }: any) {
    useEffect(() => {
      signOut()
      DeviceEventEmitter.emit(ReducerType.SIGN_OUT);
    })
    return (
      <SafeAreaView style={{ backgroundColor: Color.primary }}>
        <Text>Cerrar Sesión</Text>
      </SafeAreaView>
    );
  }


  return (
    <>
      {isLogin && !tokenValido &&
        <ToAuthorized />}
      <NavigationContainer>
      <Drawer.Navigator useLegacyImplementation initialRouteName={MenuPathEnum.JORNADA_HOME}
      drawerContent={(props: any) => {
        const filteredProps = {
          ...props,
          state: {
            ...props.state,
            routes: props.state.routes
          },

        };
        return (
          <MenuSideBar {...filteredProps} />
        );
      }}
      
      // screenListeners={{
      //   state: (e) => {
      //     // Do something with the state
      //     console.info('nav state changed', e.data);
      //   },
      // }}

      screenOptions={{
        drawerLabelStyle: {
          color: Color.secondary,
          fontWeight: 'bold'
        },
        unmountOnBlur:true
      }}

    >
      {isLogin ?
        <>
          <Drawer.Screen name={MenuPathEnum.JORNADA_HOME} component={JornadaNavigation} options={{ headerShown: false }} />
          <Drawer.Screen name={MenuPathEnum.TAREA_HOME} component={TareaNavigation} options={{ headerShown: false }} />
          <Drawer.Screen name={MenuPathEnum.CLIENTE_HOME} component={ClienteNavigation} options={{ headerShown: false }} />
          <Drawer.Screen name={MenuPathEnum.SETTINGS_HOME} component={SettingNavigation} options={{ headerShown: false }} />
          <Drawer.Screen name={MenuPathEnum.LOGOUT} component={Logout} />
        </>

        :
        <Drawer.Screen name={MenuPathEnum.LOGIN} component={Login} options={{ headerShown: false }} />}
    </Drawer.Navigator>
      </NavigationContainer>

    </>
  )
}

AppNavigator.propTypes = {}

export default AppNavigator;