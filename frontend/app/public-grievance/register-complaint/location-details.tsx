import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { AuthButton } from '@/components/auth-button';
import { LocationInput } from '@/components/location-input';
import { getLocationDetails } from '@/services/pgr-api';
import { ActivityIndicator } from 'react-native';

export default function LocationDetailsScreen() {
  const params = useLocalSearchParams();
  const [street, setStreet] = useState('');
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [landmark, setLandmark] = useState('');
  const [addressText, setAddressText] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // When location is selected, fetch location details from GIS API
    if (latitude && longitude) {
      fetchLocationDetails();
    }
  }, [latitude, longitude]);

  const fetchLocationDetails = async () => {
    if (!latitude || !longitude) return;

    setLoadingLocation(true);
    try {
      const response = await getLocationDetails(latitude, longitude);
      if (response.features && response.features.length > 0) {
        // Use the first feature's road_name as street
        const firstFeature = response.features[0];
        setStreet(firstFeature.properties.road_name);
        setLocationData(firstFeature.properties);
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!addressText.trim()) {
      newErrors.address = 'Location is required';
    }

    if (!latitude || !longitude) {
      newErrors.coordinates = 'Please select a location on the map';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    router.push({
      pathname: '/public-grievance/register-complaint/complaint-type',
      params: {
        ...params,
        street: street || addressText,
        latitude: latitude?.toString() || '',
        longitude: longitude?.toString() || '',
        landmark: landmark.trim(),
        roadId: locationData?.road_id || '',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Complaint Location Details</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>
          2. Complaint Location Details
        </ThemedText>

        {/* Location Input */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Street *</ThemedText>
          <LocationInput
            value={addressText}
            onLocationSelect={(address, lat, lng) => {
              setAddressText(address);
              setLatitude(lat || null);
              setLongitude(lng || null);
              if (errors.address) setErrors({ ...errors, address: '' });
            }}
            error={errors.address}
            placeholder="Search for address or landmark"
          />
          {errors.address && <ThemedText style={styles.errorText}>{errors.address}</ThemedText>}
        </View>

        {/* Loading indicator */}
        {loadingLocation && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#016ACD" />
            <ThemedText style={styles.loadingText}>Fetching location details...</ThemedText>
          </View>
        )}

        {/* Street (auto-filled from GIS) */}
        {street && (
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Street Name</ThemedText>
            <TextInput
              style={styles.input}
              value={street}
              editable={false}
              placeholder="Street name will be auto-filled"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        )}

        {/* Coordinates Display */}
        {(latitude !== null && longitude !== null) && (
          <View style={styles.coordinatesContainer}>
            <View style={styles.coordinateRow}>
              <ThemedText style={styles.coordinateLabel}>Longitude:</ThemedText>
              <ThemedText style={styles.coordinateValue}>{longitude.toFixed(6)}</ThemedText>
            </View>
            <View style={styles.coordinateRow}>
              <ThemedText style={styles.coordinateLabel}>Latitude:</ThemedText>
              <ThemedText style={styles.coordinateValue}>{latitude.toFixed(6)}</ThemedText>
            </View>
          </View>
        )}

        {errors.coordinates && (
          <ThemedText style={styles.errorText}>{errors.coordinates}</ThemedText>
        )}

        {/* Landmark */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Landmark</ThemedText>
          <TextInput
            style={styles.input}
            value={landmark}
            onChangeText={(text) => {
              setLandmark(text);
            }}
            placeholder="Enter nearby landmark (optional)"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Location Info Card */}
        {locationData && (
          <View style={styles.infoCard}>
            <ThemedText style={styles.infoCardTitle}>Location Information</ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Region:</ThemedText>
              <ThemedText style={styles.infoValue}>{locationData.region}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Zone:</ThemedText>
              <ThemedText style={styles.infoValue}>{locationData.new_zone}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Ward:</ThemedText>
              <ThemedText style={styles.infoValue}>{locationData.new_ward}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Road ID:</ThemedText>
              <ThemedText style={styles.infoValue}>{locationData.road_id}</ThemedText>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <Pressable style={styles.previousButton} onPress={() => router.back()}>
            <ThemedText style={styles.previousButtonText}>Previous</ThemedText>
          </Pressable>
          <AuthButton
            title="Next"
            onPress={handleNext}
            style={{ flex: 1, backgroundColor: '#016ACD' }}
            textColor="#fff"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginRight: 28,
  },
  headerSpacer: {
    width: 28,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#016ACD',
  },
  coordinatesContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  coordinateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  coordinateValue: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'monospace',
  },
  infoCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  previousButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
  },
  previousButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});
