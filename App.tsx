/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { type PropsWithChildren, useEffect, useState } from 'react';
import {
  useColorScheme,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { Provider } from 'react-redux';
import AppNavigator from './src/screens/navigators/AppNavigator';
import { store } from './src/store'
import JailMonkey from 'jail-monkey'
import { Text } from 'react-native-paper';
import NotAuthorized from './src/screens/session/NotAuthorized'

const App = () => {
  const [isRooted, setIsRooted] = useState<boolean>(false);

  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    console.log("rooted", JailMonkey.isJailBroken())
    setIsRooted(JailMonkey.isJailBroken())
  }, []);


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  return (
      !isRooted ?
        <Provider store = { store }>
      < AppNavigator />
    </Provider >
    :
    <NotAuthorized/>
  );
};



export default App;
