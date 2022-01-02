import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  CreateHabit?: Habit;
  HabitDetail: {
    id: string;
    title: string;
  };
};

export type ScreenProps<RouteName = keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, RouteName>;

export type Timestamp = string;
export type UserUid = string;
export type HabitId = string;
export interface Habit {
  id: HabitId;
  completed: Timestamp[];
  description?: string;
  title: string;
  user: UserUid;
  created: Timestamp;
}
