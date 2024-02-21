import { getHeaderTitle } from "@react-navigation/elements";
import { StackHeaderProps } from "@react-navigation/stack";
import { Animated, PlatformColor, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppCTAButton from "../../ui/buttons/AppCTAButton";
import AppText from "../../ui/texts/AppText";
import { StatusBar } from "expo-status-bar";

export const RootStackHeader = ({
  navigation,
  route,
  options,
  layout,
  progress,
  back,
  styleInterpolator,
}: StackHeaderProps) => {

  const safeArea = useSafeAreaInsets();
  const title = getHeaderTitle(options, route.name);
  return (
    <Animated.View
      style={[
        {
          position: "relative",

          height: 100,

          paddingTop: safeArea.top,
          marginHorizontal: Math.max(safeArea.left, safeArea.right) + 10,

          backgroundColor: PlatformColor("white"),

          flexDirection: "row",

          alignItems: "center",
          justifyContent: "center",
        },
        options.headerStyle,
      ]}
    >
      <StatusBar style="dark"></StatusBar>

      {back && (
        <View
          style={[
            {
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,

              marginTop: safeArea.top,

              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <AppCTAButton
            variant={"primary"}
            verticalOffset={0}
            
            title={`Back to ${back.title}`}
            fontSize={10}
            onPress={(e) => {
              navigation.goBack();
            }}
          />
        </View>
      )}

      <AppText
        style={{
          alignSelf: "center",
          fontSize: 24,
          fontWeight: "900",
          textTransform: "uppercase",
        }}
      >
        {`${title}`}
      </AppText>
    </Animated.View>
  );
}