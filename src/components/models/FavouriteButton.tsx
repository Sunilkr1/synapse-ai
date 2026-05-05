import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { Theme } from '../../constants/theme';

interface FavouriteButtonProps {
  isFavourite: boolean;
  onToggle: () => void;
}

export function FavouriteButton({ isFavourite, onToggle }: FavouriteButtonProps) {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.btn} activeOpacity={0.7}>
      <Star size={20} color={isFavourite ? '#FBBF24' : Theme.colors.dark.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 6 },
});
