import { View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function SelectGuestsScreen() {
  const params = useLocalSearchParams();
  const placeUniqueName = params.place_unique_name as string;
  const [selectedGuests, setSelectedGuests] = useState<number | null>(null);

  const handleContinue = () => {
    if (selectedGuests) {
      router.push({
        pathname: '/places/booking/select-datetime',
        params: {
          place_unique_name: placeUniqueName,
          guests: selectedGuests.toString(),
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />
      <View style={styles.modalContainer}>
        <SafeAreaView edges={['bottom']} style={styles.modalContent}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Select number of guests</ThemedText>
            <Pressable onPress={() => router.back()} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000000" />
            </Pressable>
          </View>

          <View style={styles.guestOptions}>
            {[1, 2, 3, 4, 5].map((count) => (
              <Pressable
                key={count}
                style={[
                  styles.guestButton,
                  selectedGuests === count && styles.guestButtonSelected,
                ]}
                onPress={() => setSelectedGuests(count)}
              >
                <ThemedText
                  style={[
                    styles.guestButtonText,
                    selectedGuests === count && styles.guestButtonTextSelected,
                  ]}
                >
                  {count}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[
              styles.continueButton,
              !selectedGuests && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedGuests}
          >
            <ThemedText
              style={[
                styles.continueButtonText,
                !selectedGuests && styles.continueButtonTextDisabled,
              ]}
            >
              Continue
            </ThemedText>
          </Pressable>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    zIndex: 1,
  },
  modalContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  closeButton: {
    padding: 4,
  },
  guestOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 32,
  },
  guestButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButtonSelected: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  guestButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  guestButtonTextSelected: {
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
