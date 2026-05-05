import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function OfflineBanner() {
  const { isConnected } = useNetInfo();
  const insets = useSafeAreaInsets();

  if (isConnected === true || isConnected === null) {
    return null;
  }

  return (
    <View style={[styles.banner, { paddingTop: insets.top + 4 }]}>
      <WifiOff size={16} color="#fff" />
      <Text style={styles.text}>Internet connection appears to be offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { 
    backgroundColor: '#EF4444', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: 16, 
    paddingBottom: 10, 
    gap: 8,
    width: '100%'
  },
  text: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
