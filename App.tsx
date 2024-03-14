import { useEffect, useState } from "react";
import "react-native-gesture-handler";
import {
  Platform,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaProvider,
} from "react-native-safe-area-context";

import * as SecureStore from 'expo-secure-store';
import { AuthContext } from "./src/contexts/AuthContext";
import { UserContext } from "./src/contexts/UserContext";


import RootStack from "./src/navigation/RootStack/RootStack";
import Spotify from "./src/api/Spotify";
import AppText from "./src/ui/texts/AppText";

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
  

  useEffect(() => {

    const loadProfileInfo = async() => {
      console.log("Loading Profile Info... token:", credentials.tokens.access_token);
      const raw = await Spotify.getProfileInfo(credentials);
      setUser(raw);
    }
    
    if(credentials?.tokens?.access_token) loadProfileInfo();

  }, [credentials])

  if (loggedIn && !user) {
    return (
      <View>
        <AppText>
          Loading
        </AppText>
      </View>
    )
  }

  return (
      <SafeAreaProvider>
          
        <AuthContext.Provider value={{
          loggedIn,
          credentials,
          setCredentials,
          clearCredentials
        }}>
          <UserContext.Provider value={{
            user,
            setUser
          }}>
            <RootStack />
          </UserContext.Provider>
        </AuthContext.Provider>
      </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {},
});
