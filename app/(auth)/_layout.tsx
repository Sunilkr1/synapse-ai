import { Stack } from 'expo-router';
import { Theme } from '../../src/constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      initialRouteName="onboarding"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Theme.colors.dark.background },
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
