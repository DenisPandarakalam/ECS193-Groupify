import { useContext, useEffect } from "react";

import { Platform, PlatformColor, StyleSheet, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import AppText from "../../ui/texts/AppText";
import AppCTAButton from "../../ui/buttons/AppCTAButton";

import { ClientID, ClientSecret, RedirectURI } from "@env";
import { AuthContext } from "../../contexts/AuthContext";

import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from 'expo-linear-gradient';


import { useAuthRequest } from "expo-auth-session";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaskedView from "@react-native-masked-view/masked-view";
import { RootStackNavigationProp, RootStackScreenProps } from "../../navigation/types";

const SpotifyGreen = "#1ed760";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};


export default function Login({ route, navigation }: RootStackScreenProps<"Login">) {

  /** Hooks */
  const safeArea = useSafeAreaInsets();

  /** Context */
  const authContext = useContext(AuthContext);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: ClientID,

      scopes: ["user-read-playback-state", "user-modify-playback-state"],

      // To follow the "Authorization Code Flow with PKCE" to fetch token after authorizationEndpoint
      usePKCE: true,
      redirectUri: RedirectURI,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      
      const { code, state } = response.params;
      const { codeVerifier } = request;

      let raw = {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: RedirectURI,
        client_id: ClientID,
        code_verifier: codeVerifier,
      };

      const body = Object.entries(raw)
        .map((params) => `${params[0]}=${params[1]}`)
        .join("&");

      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      })
        .then((response) => response.json())
        .then((tokens) => {
          console.log(tokens);
          authContext.setCredentials((old) => ({
            ...old,
            tokens,
            code,
            state,
          }));
        });
    }
  }, [response]);

  return (
    <View
      style={{
        flex: 1,

        position: 'relative',

        paddingTop: safeArea.top,
      }}
    >
      <MaskedView
        style={{ 
          position: 'absolute',

          left: 0,
          right: 0,
          top: 0,
          bottom: 0,

          paddingTop: safeArea.top,
        }}
        maskElement={
          <View
            style={{
              marginTop: safeArea.top,

              flex: 1,

              backgroundColor: 'transparent',

              paddingTop: '20%',

              alignItems: 'center',
            }}
          >
            <AppText
              style={{
                fontSize: 72,
                fontWeight: 'bold',
              }}
            >
              groupify
            </AppText>
            <AppText
              style={{
                fontSize: 12,
                fontWeight: 'normal',
              }}
            >
              the perfect dj
            </AppText>
          </View>
        }
      >
        <LinearGradient
          style={[
            {   
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }
          ]}
          // Background Linear Gradient
          colors={[SpotifyGreen, 'black']}
          start={[0.5, 0.25]}
          end={[0.5, 0.5]}
        />
      </MaskedView>

      <View
        style={{
          position: 'absolute',

          left: 0,
          right: 0,
          top: '50%',
          bottom: 0,

          paddingHorizontal: "25%"
        }}
      >
        <AppCTAButton 
          title={!authContext.loggedIn ? "Connect With Spotify" : "Home"}
          onPress={
            () => {
              if (authContext.loggedIn)
                navigation.navigate("Home");
              else
                promptAsync();
            }
          }
        />
        {
          authContext.loggedIn &&
          <AppCTAButton 
            title={"Log Out"}
            onPress={() => {
              authContext.clearCredentials();
            }}
          />
        }
      </View>
    </View>
  );
}