import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../../constants/theme';

interface DividerProps {
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({ style }) => {
  return (
    <View style={[
      styles.divider, 
      { backgroundColor: Theme.colors.dark.border },
      style
    ]} />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
});
