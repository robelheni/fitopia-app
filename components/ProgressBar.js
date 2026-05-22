import { View, Text, StyleSheet } from 'react-native';
import {colors} from '../constants/colors';

export default function ProgressBar({currentStep, totalSteps}) {

    const progress = (currentStep/totalSteps) * 100;
    return (
        <View style = {styles.container}>
            <View style = {styles.track}>

                <View style={[styles.fill, { width: `${progress}%` }]} />

                

            </View>
            <Text style={styles.label}>{currentStep} of {totalSteps}</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
    },

    track: {
        height: 4,
        backgroundColor: colors.greyBorder,
        borderRadius: 100,
        marginBottom: 8,
    },

    // Fill sits inside track and grows based on progress percentage
    fill: {
        height: 4,
        backgroundColor: colors.blue,
        borderRadius: 100,
    },

    label: {
        fontSize: 12,
        color: colors.greyLight,
        textAlign: 'right',
    },
});