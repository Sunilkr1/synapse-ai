import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet, StatusBar as RNStatusBar, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/queries/queryClient';
import { supabase } from '../src/services/supabase/client';
import { useAuthStore } from '../src/stores/authStore';
import { ProfileService } from '../src/services/supabase/profiles';
import { useSettingsStore } from '../src/stores/settingsStore';
import { setupNotifications } from '../src/services/notifications/setup';
import { LogBox } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { useNotificationStore } from '../src/stores/notificationStore';
import { OfflineBanner } from '../src/components/ui/OfflineBanner';

// Ignore specific warnings
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
  '[Layout children]: No route named "compare/[id]" exists',
  'Notifications: Remote notifications are bypassed',
]);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({});
  const setSession = useAuthStore(s => s.setSession);
  const session = useAuthStore(s => s.session);
  const initialized = useAuthStore(s => s.initialized);
  const router = useRouter();
  const segments = useSegments();
  const { colors, theme } = useTheme();

  // Listen for deep links (OAuth redirects)
  const url = Linking.useURL();
  
  useEffect(() => {
    if (url) {
      const parsed = Linking.parse(url);
      console.log('--- DEEP LINK DETECTED ---');
      console.log('Full URL:', url);
      console.log('Parsed Object:', JSON.stringify(parsed, null, 2));

      // Supabase tokens can be in queryParams OR hash fragments
      const params: any = { ...parsed.queryParams };
      
      // If it's a hash fragment, we might need to parse it manually
      if (url.includes('#')) {
        const hash = url.split('#')[1];
        hash.split('&').forEach(part => {
          const [key, value] = part.split('=');
          params[key] = value;
        });
      }
      
      if (params.access_token && params.refresh_token) {
        console.log('Tokens found! Setting session...');
        supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        }).then(({ error }) => {
          if (error) console.error('Supabase SetSession Error:', error.message);
          else console.log('Session set successfully!');
        });
      }
    }
  }, [url]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('--- AUTH STATE CHANGE ---');
      console.log('Event:', _event);
      console.log('User:', session?.user?.email || 'No User');
      
      setSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('Initial Session Found:', session.user.email);
        setSession(session);
      }
    });

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data as any;
      const title = notification.request.content.title || 'New Notification';
      const body = notification.request.content.body || '';

      useNotificationStore.getState().addNotification({
        title: title,
        body: body,
        type: data?.type || 'info',
        data: data
      });

      // Show alert if app is in foreground
      Alert.alert(title, body);
    });

    return () => {
      subscription.unsubscribe();
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  // Update push token when session is available
  useEffect(() => {
    if (session?.user?.id) {
      setupNotifications().then(token => {
        if (token) {
          console.log('Syncing Push Token to Profile:', token);
          ProfileService.updateProfile(session.user.id, { push_token: token })
            .then(res => {
              if (res.success) console.log('Push Token successfully synced to DB');
              else console.error('Push Token sync failed:', res.error);
            });
        }
      });
    }
  }, [session]);

  // Route guard — redirect to login if unauthenticated
  useEffect(() => {
    console.log('--- NAVIGATION GUARD ---');
    console.log('Session exists:', !!session);
    console.log('Initialized:', initialized);
    console.log('Segments:', segments);

    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      console.log('Redirecting to Onboarding...');
      router.replace('/(auth)/onboarding');
    } else if (session && inAuthGroup) {
      console.log('Redirecting to Tabs...');
      router.replace('/(tabs)');
      
      // Load user profile from Supabase but prioritize local changes
      const loadProfile = async () => {
        const profile = await ProfileService.getProfile(session.user.id);
        if (profile) {
          const currentSettings = useSettingsStore.getState();
          
          // Only update local store if it differs from the remote profile 
          // and we don't have a strong local preference yet (or just sync them)
          // For now, let's just make sure we sync it once but don't force 'dark' 
          // if the user has explicitly set 'light' locally.
          
          // Note: The store now has 'persist', so it will remember 'light' 
          // between app restarts. We only sync from DB if the user is on a NEW device.
          if (!currentSettings._hasHydrated) {
             useSettingsStore.getState().updateSettings({
               theme: profile.theme as any,
               accentColor: profile.accent_color,
             });
          }
        } else {
          // Create initial profile if it doesn't exist
          ProfileService.updateProfile(session.user.id, {
            email: session.user.email,
            theme: useSettingsStore.getState().theme,
            accent_color: useSettingsStore.getState().accentColor,
          });
        }
      };
      loadProfile();
    }
  }, [session, initialized, segments]);

  useEffect(() => {
    if (fontsLoaded && initialized) {
      SplashScreen.hideAsync();
    }
    
    // Enable edge-to-edge on Android
    if (Platform.OS === 'android') {
      RNStatusBar.setTranslucent(true);
      RNStatusBar.setBackgroundColor('transparent');
    }
  }, [fontsLoaded, initialized]);

  // Don't render anything until both fonts AND auth state are ready.
  // This prevents the onboarding flash on app restart.
  if (!fontsLoaded || !initialized) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} translucent />
            <OfflineBanner />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'fade_from_bottom',
              }}
            >
              <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
              <Stack.Screen name="chat/[id]" options={{ presentation: 'card' }} />
              <Stack.Screen name="compare" options={{ presentation: 'card' }} />
              <Stack.Screen name="personas/index" options={{ presentation: 'card' }} />
              <Stack.Screen name="personas/[id]" options={{ presentation: 'card' }} />
              <Stack.Screen name="prompts/index" options={{ presentation: 'card' }} />
              <Stack.Screen name="prompts/[id]" options={{ presentation: 'card' }} />
              <Stack.Screen name="models/index" options={{ presentation: 'card' }} />
              <Stack.Screen name="stats/index" options={{ presentation: 'card' }} />
              <Stack.Screen name="keys/index" options={{ presentation: 'card' }} />
              <Stack.Screen name="notifications" options={{ presentation: 'card', animation: 'slide_from_right' }} />
            </Stack>
          </View>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
