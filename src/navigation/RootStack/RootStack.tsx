import React, { useContext, useEffect } from "react";
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
import { AuthContext } from "../../contexts/AuthContext";
import Create from "../../screens/Create/Create";
import Join from "../../screens/Join/Join";

const RootStackNavigator = createStackNavigator<RootStackParamList>();

export default function RootStack() {

    /** Context */
    const authContext = useContext(AuthContext);

    return (
        <NavigationContainer>
            <RootStackNavigator.Navigator
                id="RootStack"
                initialRouteName={!authContext.loggedIn ? "Login" : "Home"}
                screenOptions={{
                    headerStyleInterpolator: Platform.select({
                        ios: HeaderStyleInterpolators.forUIKit,
                        default: HeaderStyleInterpolators.forFade,
                    }),
                    header: RootStackHeader,
                    headerShown: false
                }}
            >
                {
                    !authContext.loggedIn ?
                    <RootStackNavigator.Screen
                        name="Login"
                        component={Login}
                        options={{
                            animationTypeForReplace: !authContext.loggedIn ? 'pop' : 'push',
                        }}
                    /> :
                    <>
                        <RootStackNavigator.Screen
                            name="Home"
                            component={Home}
                            options={{}}
                        />
                        <RootStackNavigator.Screen
                            name="Create"
                            component={Create}
                            options={{}}
                        />
                        <RootStackNavigator.Screen
                            name="Join"
                            component={Join}
                            options={{}}
                        />
                    </>
                }
            </RootStackNavigator.Navigator>
        </NavigationContainer>
    );
};
