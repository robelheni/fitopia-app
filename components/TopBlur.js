import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

export default function TopBlur() {
    const insets = useSafeAreaInsets();
    const scheme = useColorScheme();
    const height = insets.top + 20;

    // Gradient fades from the background color to transparent
    // This creates a soft fade effect as content scrolls under the status bar
    const topColor = scheme === 'dark' ? 'rgba(15,15,15,1)' : 'rgba(255,255,255,1)';
    const bottomColor = scheme === 'dark' ? 'rgba(15,15,15,0)' : 'rgba(255,255,255,0)';

    return (
        <View
            style={[styles.container, { height }]}
            pointerEvents="none"
        >
            <LinearGradient
                colors={[topColor, bottomColor]}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
});
