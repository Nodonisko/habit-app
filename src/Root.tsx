import React from "react";

import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignIn } from "./screens/SignInScreen";
import { SignUp } from "./screens/SignUpScreen";
import { Home, homeOptions } from "./screens/Home";
import { RootStackParamList } from "./types";
import { CreateHabitScreen } from "./screens/CreateHabitScreen";
import {
  habitDetailOptions,
  HabitDetailScreen,
} from "./screens/HabitDetailScreen";
import { Portal } from "react-native-paper";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Root() {
  return (
    <Portal.Host>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ title: "Sign in" }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: "Sign up" }}
          />

          <Stack.Screen name="Home" component={Home} options={homeOptions} />
          <Stack.Screen name="CreateHabit" component={CreateHabitScreen} />
          <Stack.Screen
            name="HabitDetail"
            component={HabitDetailScreen}
            options={habitDetailOptions}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Portal.Host>
  );
}
