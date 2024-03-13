import { Platform, PlatformColor, StyleSheet, View } from "react-native";
import AppText from "../../ui/texts/AppText";
import { StackScreenProps } from "@react-navigation/stack";
import AppCTAButton from "../../ui/buttons/AppCTAButton";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import RecursiveJSON from "../../components/RecursiveJSON";
import Spotify from "../../api/Spotify";
import { RootStackScreenProps } from "../../navigation/types";

export default function Home({ route, navigation }: RootStackScreenProps<"Home">) {
  
  const authContext = useContext(AuthContext);

  const [profileInfo, setProfileInfo] = useState(null);
  const [playerQueue, setPlayerQueue] = useState<{
    currently_playing: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull;
    queue: SpotifyApi.TrackObjectFull[] | SpotifyApi.EpisodeObjectFull[];
  }>(null);


  return (
    <View style={styles.container}>
      <AppText>Welcome to Groupify!</AppText>

      <AppText>This is the {route.name} screen</AppText>

      <AppCTAButton
        title="Navigate Login"
        onPress={() => {
          navigation.navigate("Login");
        }}
      />

      <AppText style={{fontWeight:'bold'}}>Context Testing</AppText>
      {
        authContext?.credentials &&
        <AppText>{Object.keys(authContext.credentials).join(', ')}</AppText>
      }

      <View
        style={{
          flexDirection: 'row'
        }}
      >

        <AppCTAButton
          title="Get Profile Info"
          onPress={async () => {
            const raw = await Spotify.getProfileInfo(authContext.credentials.tokens.access_token);
            setProfileInfo(raw);
            setPlayerQueue(null);
          }}
        />

        <AppCTAButton
          title="Get Player Queue"
          onPress={async () => {
            const raw = await Spotify.getPlayerQueue(authContext.credentials.tokens.access_token);
            setPlayerQueue(raw);
            setProfileInfo(null);
          }}
        />

        <AppCTAButton
          title="Play Freak N You"
          onPress={async () => {
            const raw = await Spotify.playSong(
              authContext.credentials.tokens.access_token,
              ["spotify:track:7C0BHTRLmWUONc8OYjOPdW"]
            );
            console.log(raw);
          }}
        />

      </View>

      {
        profileInfo &&
        <RecursiveJSON data={profileInfo}/>
      }

      {
        playerQueue &&
        <View>
          <AppText>
            {playerQueue.currently_playing.name}
          </AppText>
          {
            playerQueue.queue.map(
              (track, index) => (
                <AppText
                  key={index}
                > 
                  {track.name}
                </AppText>
              )
            )
          }
        </View>
      }

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
        backgroundColor: PlatformColor("systemBlue"),
        color: "#fff",
      },
    }),
  },
});
