import { useContext, useEffect } from "react";

import { Dimensions, View } from "react-native";


import { ClientID, ClientSecret, RedirectURI } from "@env";
import { AuthContext } from "../../contexts/AuthContext";

import * as WebBrowser from "expo-web-browser";


import { useAuthRequest } from "expo-auth-session";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../navigation/types";
import { StatusBar } from "expo-status-bar";
import AppText from "../../ui/texts/AppText";
import AppPressable from "../../ui/buttons/AppPressable";
import AppCTAButton from "../../ui/buttons/AppCTAButton";

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
        marginTop: safeArea.top,
      }}
    >
      <StatusBar style="dark"/>

      <View 
        style={{
          position: 'absolute',
          backgroundColor: '#1ED760',
          bottom: '0%',
          left: '-50%',
          width: '200%',
          aspectRatio: 1,
          borderRadius: Dimensions.get('window').width,
          opacity: 0.25
        }}
      />

      <View 
        style={{
          position: 'absolute',
          backgroundColor: '#1ED760',
          bottom: '-5%',
          left: '-50%',
          width: '200%',
          aspectRatio: 1,
          borderRadius: Dimensions.get('window').width,
          opacity: 0.5
        }}
      />

      <View 
        style={{
          position: 'absolute',
          backgroundColor: '#1ED760',
          bottom: '-10%',
          left: '-50%',
          width: '200%',
          aspectRatio: 1,
          borderRadius: Dimensions.get('window').width
        }}
      />

      <View
        id="content-view"
        nativeID="content-view"

        style={{
          flex: 1,
          paddingTop: '50%',
        }}
      >
        <AppText
          style={{
            fontSize: 58,
            fontWeight: 'bold'
          }}
        >
          JukeBox
        </AppText>
        <AppText
          style={{
            marginTop: '30%',
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          Please Log In
        </AppText>
        <View
          style={{
            paddingHorizontal: '20%'
          }}
        >
          <AppCTAButton
            style={{
              marginTop: '10%'
            }}
            title={!authContext.loggedIn ? "Connect With Spotify" : "Home"} 
            onPress={() => {
              if (authContext.loggedIn)
                navigation.navigate("Home");
              else
                promptAsync();
            }}
          />
        </View>
      </View>
    </View>
  );
}