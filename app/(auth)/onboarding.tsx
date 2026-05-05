import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Brain, Zap, User, Shield, ChevronRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const SLIDES = [
    {
      id: '1',
      title: 'Multi-Model AI',
      description: 'Switch between Gemini, GPT-4o, Claude 3.5 and more in a single tap.',
      icon: <Brain size={80} color={colors.accent} />,
      color: colors.accent,
    },
    {
      id: '2',
      title: 'Multimodal Power',
      description: 'Chat with text, analyze images, and record audio effortlessly.',
      icon: <Zap size={80} color={colors.accent} />,
      color: colors.accent,
    },
    {
      id: '3',
      title: 'Persona Hub',
      description: 'Customize AI personas for Coding, Writing, or specialized help.',
      icon: <User size={80} color={colors.accent} />,
      color: colors.accent,
    },
    {
      id: '4',
      title: 'Private & Secure',
      description: 'Your data belongs to you. Secure Supabase storage and local privacy.',
      icon: <Shield size={80} color={colors.accent} />,
      color: colors.accent,
    },
  ];

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push('/(auth)/login');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={SLIDES}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
              {item.icon}
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>
            </View>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        ref={slidesRef}
      />

      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dot, 
                { 
                  width: i === currentIndex ? 24 : 8, 
                  backgroundColor: i === currentIndex ? colors.accent : colors.border 
                }
              ]} 
            />
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.nextBtn, { backgroundColor: colors.text }]} 
          onPress={handleNext}
        >
          <Text style={[styles.nextText, { color: colors.background }]}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ChevronRight size={20} color={colors.background} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { width, justifyContent: 'center', alignItems: 'center', padding: 40 },
  iconContainer: { width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  textContainer: { alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  description: { fontSize: 16, textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, paddingBottom: 40 },
  pagination: { flexDirection: 'row', gap: 8 },
  dot: { height: 8, borderRadius: 4 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30 },
  nextText: { fontSize: 16, fontWeight: 'bold' },
});
