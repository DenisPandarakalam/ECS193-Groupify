import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
};

export type RootStackNavigationProp<T extends keyof RootStackParamList> = StackNavigationProp<RootStackParamList, T>;
export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;