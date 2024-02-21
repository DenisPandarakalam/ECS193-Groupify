import { useEffect, useRef, useState } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  StackHeaderProps,
} from "@react-navigation/stack";
import {
  Animated,
  Platform,
  PlatformColor,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getHeaderTitle } from "@react-navigation/elements";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Login from "./src/screens/Login/Login";
import Home from "./src/screens/Home/Home";
import AppText from "./src/ui/texts/AppText";
import AppCTAButton from "./src/ui/buttons/AppCTAButton";

import { AuthContext } from "./src/contexts/AuthContext";

import * as SecureStore from 'expo-secure-store';
import RootStackHeader from "./src/components/RootStackHeader";
import LoginV2 from "./src/screens/LoginV2/LoginV2";
import { UserContext } from "./src/contexts/UserContext";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export default function App() {

  /** User Context State */
  const [user, setUser] = useState<SpotifyApi.UserObjectPrivate>(null);
  
  /** Auth Context State */
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const clearCredentials = async () => {
    try {
      setCredentials(() => {
        return(null)
      });
    } catch (e) {
      console.log(e);
    }
  }
  
  /** Local State */
  const [initialized, setInitialized] = useState(false);
      
  const _initialize = async () => {
    console.log('Initializing...');

    if (Platform.OS !== 'web') {

      // Securely get the auth from your device
      const credentialsFromStorage = await SecureStore.getItemAsync('GROUPIFY_CREDENTIALS');

      console.log("Credentials From SecureStorage:", credentialsFromStorage);

      if(credentialsFromStorage && credentialsFromStorage !== '{}') {
        setCredentials(() => {
          return(JSON.parse(credentialsFromStorage))
        });
      }
      else {
        setCredentials(() => {
          return(null);
        })
      }
    }

    setInitialized(true);
  }

  const _updateSecureStorage = async () => {
    console.log('Updating SecureStorage');

    if (Platform.OS !== 'web') {
      if(credentials === null) {

        setLoggedIn(false);

        // Securely delete the auth from your device
        SecureStore.deleteItemAsync('GROUPIFY_CREDENTIALS');
        console.log("Cleared Credentials in Local Storage.");
      } else {

        setLoggedIn(true);

        // Securely store the auth on your device
        SecureStore.setItemAsync('GROUPIFY_CREDENTIALS', JSON.stringify(credentials));
        console.log("Updated Credentials in Local Storage.");
      }
    }
  }

  useEffect(
    () => {
      console.log(`useEffect[initialized, credentials]:`, initialized, credentials)
      if(!initialized) {
        _initialize();
      }
      else {
        _updateSecureStorage();
      }
    },
    [initialized, credentials]
  )

  return (
      <SafeAreaProvider>
          
        <AuthContext.Provider value={{
          loggedIn,
          credentials,
          setCredentials,
          clearCredentials
        }}>
          <UserContext.Provider value={user}>
          <NavigationContainer>
              <RootStack.Navigator
                id="RootStack"
                initialRouteName="Login"
                screenOptions={{
                  headerStyleInterpolator: Platform.select({
                    ios: HeaderStyleInterpolators.forUIKit,
                    default: HeaderStyleInterpolators.forFade,
                  }),
                  header: RootStackHeader,
                }}
              >
                <RootStack.Screen name="Login" component={LoginV2} options={{headerShown:false}}/>
                <RootStack.Screen name="Home" component={Home} options={{title:"Groupify"}}/>
              </RootStack.Navigator>
            </NavigationContainer>
          </UserContext.Provider>
        </AuthContext.Provider>
      </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {},
});
