import { Dimensions, Platform, PlatformColor, StyleSheet, View } from "react-native";
import AppText from "../../ui/texts/AppText";
import AppCTAButton from "../../ui/buttons/AppCTAButton";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { RootStackScreenProps } from "../../navigation/types";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Spotify from "../../api/Spotify";
import { UserContext } from "../../contexts/UserContext";

export default function Home({
    route,
    navigation,
}: RootStackScreenProps<"Home">) {
  
    /** Hooks */
    const safeArea = useSafeAreaInsets();

    /** Context */
    const authContext = useContext(AuthContext);
    const userContext = useContext(UserContext);

    // TODO: this might be important later
    // const [playerQueue, setPlayerQueue] = useState<{
    //     currently_playing:
    //         | SpotifyApi.TrackObjectFull
    //         | SpotifyApi.EpisodeObjectFull;
    //     queue: SpotifyApi.TrackObjectFull[] | SpotifyApi.EpisodeObjectFull[];
    // }>(null);

    return (
        <View
            style={{
                flex: 1,
                position: "relative",
                marginTop: safeArea.top,
            }}
        >
            <StatusBar style="dark" />

            <View
                style={{
                    position: "absolute",
                    backgroundColor: "#1ED760",
                    bottom: "0%",
                    left: "-50%",
                    width: "200%",
                    aspectRatio: 1,
                    borderRadius: Dimensions.get("window").width,
                    opacity: 0.25,
                }}
            />

            <View
                style={{
                    position: "absolute",
                    backgroundColor: "#1ED760",
                    bottom: "-5%",
                    left: "-50%",
                    width: "200%",
                    aspectRatio: 1,
                    borderRadius: Dimensions.get("window").width,
                    opacity: 0.5,
                }}
            />

            <View
                style={{
                    position: "absolute",
                    backgroundColor: "#1ED760",
                    bottom: "-10%",
                    left: "-50%",
                    width: "200%",
                    aspectRatio: 1,
                    borderRadius: Dimensions.get("window").width,
                }}
            />

            <View
                id="content-view"
                nativeID="content-view"
                style={{
                    flex: 1,
                    paddingTop: "50%",
                }}
            >
                <AppText
                    style={{
                        fontSize: 58,
                        fontWeight: "bold",
                    }}
                >
                    JukeBox
                </AppText>
                <AppText
                    style={{
                        marginTop: "30%",
                        fontSize: 24,
                        fontWeight: "bold",
                    }}
                >
                    {`${userContext.user.display_name}`}
                </AppText>
                <View
                    style={{
                        paddingHorizontal: "20%",
                    }}
                >
                    <AppCTAButton
                        style={{
                            marginTop: "10%",
                        }}
                        title={
                          "Create a Room"
                        }
                        onPress={() => {
                        }}
                    />
                    <AppCTAButton
                        style={{
                            marginTop: "2%",
                        }}
                        title={
                          "Join a Room"
                        }
                        onPress={() => {
                        }}
                    />
                    <AppCTAButton
                      style={{
                        marginTop: '15%',
                        marginHorizontal: '10%',

                        opacity: 0.75
                      }}
                      fontSize={12}
                      title={"Log Out"}
                      onPress={() => {
                        authContext.clearCredentials();
                      }}
                    />
                </View>
            </View>
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
