import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  HeaderStyleInterpolators,
} from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { Platform } from "react-native";
import RootStackHeader from "../../components/RootStackHeader";
import Home from "../../screens/Home/Home";
import Login from "../../screens/Login/Login";

const RootStackNavigator = createStackNavigator<RootStackParamList>();

export default function RootStack() {

    return (
        <NavigationContainer>
            <RootStackNavigator.Navigator
                id="RootStack"
                initialRouteName="Login"
                screenOptions={{
                    headerStyleInterpolator: Platform.select({
                        ios: HeaderStyleInterpolators.forUIKit,
                        default: HeaderStyleInterpolators.forFade,
                    }),
                    header: RootStackHeader,
                    headerShown: false
                }}
            >
                <RootStackNavigator.Screen
                    name="Login"
                    component={Login}
                    options={{ }}
                />
                <RootStackNavigator.Screen
                    name="Home"
                    component={Home}
                    options={{ title: "Groupify" }}
                />
            </RootStackNavigator.Navigator>
        </NavigationContainer>
    );
};
