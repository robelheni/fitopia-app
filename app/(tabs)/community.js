import { ScrollView, View, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.circle, { top: 50, left: 20, width: 250, height: 250, backgroundColor: '#2563EB' }]} />
      <View style={[styles.circle, { top: 150, right: 10, width: 200, height: 200, backgroundColor: '#D4A843' }]} />
      <View style={[styles.circle, { top: 350, left: 50, width: 300, height: 300, backgroundColor: '#FF6B6B' }]} />
      <View style={[styles.circle, { top: 600, right: 20, width: 220, height: 220, backgroundColor: '#2563EB' }]} />
      <View style={[styles.circle, { top: 800, left: 10, width: 280, height: 280, backgroundColor: '#A855F7' }]} />
      <View style={[styles.circle, { top: 1000, right: 30, width: 200, height: 200, backgroundColor: '#D4A843' }]} />
      <View style={[styles.circle, { top: 1200, left: 40, width: 260, height: 260, backgroundColor: '#FF6B6B' }]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    height: 1600,
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.4,
  },
});