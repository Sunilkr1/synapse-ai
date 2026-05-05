// Default layout for the compare stack navigator
import { Stack } from 'expo-router';

export default function CompareLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
