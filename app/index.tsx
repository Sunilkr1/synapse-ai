import { Redirect } from 'expo-router';

export default function Index() {
  // Development Mode: Bypass Auth to directly see the Chat UI
  return <Redirect href="/(auth)/onboarding" />;

  return <Redirect href="/(tabs)/" />;
}
