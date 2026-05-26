
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useState } from 'react';

export default function MyPlanModal({ visible, onClose }) {

    const [editingWeight, setEditingWeight] = useState(false);
    const [newWeight, setNewWeight] = useState('');
    const [currentWeight, setCurrentWeight] = useState('75');
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>

        {/* Handle bar at top */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Plan</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={20} color={colors.black} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >

          {/* Plan items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Training profile</Text>

            <View style={styles.planCard}>

              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="trending-up" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Fitness level</Text>
                  <Text style={styles.planItemValue}>Intermediate</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </View>

              <View style={styles.planDivider} />

              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="target" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Goal</Text>
                  <Text style={styles.planItemValue}>Build muscle</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </View>

              <View style={styles.planDivider} />

              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="calendar" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Days per week</Text>
                  <Text style={styles.planItemValue}>4 days</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </View>
              <View style={styles.planDivider} />

                <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                    <Feather name="calendar" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                    <Text style={styles.planItemLabel}>Training days</Text>
                    <Text style={styles.planItemValue}>Mon, Wed, Fri</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
                </View>

              <View style={styles.planDivider} />

              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="clock" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Duration</Text>
                  <Text style={styles.planItemValue}>45 minutes</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </View>

              <View style={styles.planDivider} />

                {/* Weight — editable */}
                <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                    <Feather name="trending-up" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                    <Text style={styles.planItemLabel}>Current weight</Text>
                    {editingWeight ? (
                    <View style={styles.weightEditRow}>
                        <TextInput
                        style={styles.weightInput}
                        value={newWeight}
                        onChangeText={setNewWeight}
                        keyboardType="number-pad"
                        placeholder={currentWeight}
                        placeholderTextColor={colors.greyLight}
                        maxLength={3}
                        autoFocus
                        />
                        <Text style={styles.weightUnit}>kg</Text>
                        <TouchableOpacity
                        style={styles.weightSaveButton}
                        onPress={() => {
                            if (newWeight) setCurrentWeight(newWeight);
                            setEditingWeight(false);
                            setNewWeight('');
                        }}
                        >
                        <Text style={styles.weightSaveText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => {
                            setEditingWeight(false);
                            setNewWeight('');
                        }}
                        >
                        <Feather name="x" size={16} color={colors.greyLight} />
                        </TouchableOpacity>
                    </View>
                    ) : (
                    <Text style={styles.planItemValue}>{currentWeight} kg</Text>
                    )}
                </View>
                {!editingWeight && (
                    <TouchableOpacity onPress={() => setEditingWeight(true)}>
                    <Feather name="edit-2" size={16} color={colors.blue} />
                    </TouchableOpacity>
                )}
                </View>

            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Equipment and location</Text>

            <View style={styles.planCard}>

              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="home" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Equipment</Text>
                  <Text style={styles.planItemValue}>Dumbbells at home</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </View>

              <View style={styles.planDivider} />

              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="map-pin" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Location</Text>
                  <Text style={styles.planItemValue}>United Kingdom</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </View>

            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Food and fasting</Text>

            <View style={styles.planCard}>

              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="sun" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Food choices</Text>
                  <Text style={styles.planItemValue}>Meat eater, Ethiopian diet</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </View>

            </View>
          </View>

          {/* Update plan button */}
          <TouchableOpacity style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Update my plan</Text>
          </TouchableOpacity>

        </ScrollView>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 12,
  },

  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.greyBorder,
    alignSelf: 'center',
    marginBottom: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.grey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  planCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },

  planIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  planItemContent: {
    flex: 1,
  },

  planItemLabel: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: '300',
    marginBottom: 2,
  },

  planItemValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
  },

  planDivider: {
    height: 0.5,
    backgroundColor: colors.greyBorder,
    marginHorizontal: 16,
  },

  updateButton: {
    backgroundColor: colors.blue,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },

  updateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  weightEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  
  weightInput: {
    borderWidth: 1.5,
    borderColor: colors.blue,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 15,
    color: colors.black,
    width: 60,
  },
  
  weightUnit: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '300',
  },
  
  weightSaveButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  
  weightSaveText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
});