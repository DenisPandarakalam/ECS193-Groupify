import { useContext, useEffect } from "react";

import { Platform, PlatformColor, StyleSheet, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import AppText from "../../ui/texts/AppText";
import { RootStackParamList } from "../../../App";
import AppCTAButton from "../../ui/buttons/AppCTAButton";

import { ClientID, ClientSecret, RedirectURI } from "@env";
import { AuthContext } from "../../contexts/AuthContext";

import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import RecursiveJSON from "../../components/RecursiveJSON";


WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

type LoginProps = StackScreenProps<RootStackParamList, "Login"> & {};

export default function Login({ route, navigation }: LoginProps) {

  const authContext = useContext(AuthContext);

  console.log('Login Redirect URI:',makeRedirectUri({ scheme: 'groupify://' }));

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: ClientID,

      scopes: ['user-read-playback-state', 'user-modify-playback-state'],

      // To follow the "Authorization Code Flow with PKCE" to fetch token after authorizationEndpoint
      usePKCE: true,
      redirectUri: RedirectURI,

      // TODO: This might come in later... not sure?
      // redirectUri: makeRedirectUri({ scheme: 'groupify://' }
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {

      const { code, state } = response.params;
      const { codeVerifier } = request;

      let raw = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: RedirectURI,
        client_id: ClientID,
        code_verifier: codeVerifier
      };

      const body = Object.entries(raw).map(params => `${params[0]}=${params[1]}`).join('&');

      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      }).then(
        response => response.json()
      ).then(
        tokens => {
          authContext.setCredentials((old) => ({...old, tokens, code, state}));
        }
      )
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <AppText>Welcome to Groupify!</AppText>

      <AppText>This is the {route.name} screen</AppText>

      <AppCTAButton
        title="Navigate Home"
        onPress={() => {
          navigation.navigate("Home");
        }}
      />

      <AppText style={{fontWeight:'bold'}}>Dot-Env Testing</AppText>
      <AppText>ClientID: {ClientID}</AppText>
      <AppText>ClientSecret: {ClientSecret}</AppText>

      <AppText style={{fontWeight:'bold'}}>Auth Session Testing</AppText>
      <View style={{flexDirection: 'row'}}>
        <AppCTAButton
          title="Test Auth Session"
          onPress={
            () => {
              promptAsync();
            }
          }
        />

        <AppCTAButton
          title="Forget Credentials"
          onPress={
            () => {
              authContext.clearLocalCredentials?.();
            }
          }
        />
      </View>

      {
        authContext?.credentials &&
        <RecursiveJSON data={authContext.credentials}/>
      }

      {/* <AppText>AccessToken: {authContext.credentials?.access_token}</AppText> */}
      {/* <AppCTAButton
        title="Get Access Token"
        onPress={() => {
          const getAccessToken = async () => {
            const data = `grant_type=client_credentials&client_id=${ClientID}&client_secret=${ClientSecret}`;

            fetch("https://accounts.spotify.com/api/token", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: data,
            })
              .then((response) => response.json())
              .then((json) => {
                authContext.setCredentials(json);
              });
          };

          getAccessToken();
        }} 
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",

    ...Platform.select({
      ios: {
        backgroundColor: PlatformColor("white"),
      },
    }),
  },
});
