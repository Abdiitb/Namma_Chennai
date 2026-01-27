import { View, StyleSheet, ScrollView, Pressable, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { AuthButton } from '@/components/auth-button';
import { getComplaintCategories, getComplaintSubTypes, ComplaintCategory, ComplaintSubType } from '@/services/pgr-api';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native';
import { SimpleDropdown } from '@/components/simple-dropdown';

export default function ComplaintTypeScreen() {
  const params = useLocalSearchParams();
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | null>(null);
  const [subTypes, setSubTypes] = useState<ComplaintSubType[]>([]);
  const [selectedSubType, setSelectedSubType] = useState<ComplaintSubType | null>(null);
  const [complaintDetails, setComplaintDetails] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubTypes, setLoadingSubTypes] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadSubTypes(selectedCategory.groupid);
    } else {
      setSubTypes([]);
      setSelectedSubType(null);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await getComplaintCategories();
      if (response.ResultStatus && response.ComplaintCategoryListResult) {
        setCategories(response.ComplaintCategoryListResult);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'Failed to load complaint categories. Please try again.');
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadSubTypes = async (groupId: string) => {
    try {
      setLoadingSubTypes(true);
      setSelectedSubType(null);
      const response = await getComplaintSubTypes(groupId);
      if (response.ResultStatus && response.ComplaintCategoryListResult.length > 0) {
        const category = response.ComplaintCategoryListResult[0];
        setSubTypes(category.group);
      }
    } catch (error) {
      console.error('Error loading sub-types:', error);
      Alert.alert('Error', 'Failed to load complaint sub-types. Please try again.');
    } finally {
      setLoadingSubTypes(false);
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Media library permission is required to select photos.');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleSelectFromGallery = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUri(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedCategory) {
      newErrors.category = 'Please select a complaint type';
    }

    if (!selectedSubType) {
      newErrors.subType = 'Please select a complaint sub-type';
    }

    if (!complaintDetails.trim()) {
      newErrors.details = 'Please provide details of the complaint';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    router.push({
      pathname: '/public-grievance/register-complaint/review',
      params: {
        ...params,
        complaintType: selectedCategory?.groupname || '',
        complaintTypeId: selectedCategory?.groupid || '',
        complaintSubType: selectedSubType?.complaintname || '',
        complaintSubTypeId: selectedSubType?.id || '',
        complaintDetails: complaintDetails.trim(),
        photoUri: photoUri || '',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Complaint Type and Sub-Type</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>
          3. Complaint Type and Sub-Type
        </ThemedText>

        {/* Complaint Type */}
        <View style={styles.inputGroup}>
          {loadingCategories ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#016ACD" />
              <ThemedText style={styles.loadingText}>Loading categories...</ThemedText>
            </View>
          ) : (
            <SimpleDropdown<ComplaintCategory>
              label="Complaint Type *"
              placeholder="-- Select Complaint Type --"
              value={selectedCategory}
              onSelect={(cat) => {
                setSelectedCategory(cat);
                if (errors.category) setErrors({ ...errors, category: '' });
              }}
              options={categories.map(cat => ({
                value: cat,
                label: cat.groupname,
              }))}
              error={errors.category}
              getLabel={(cat) => cat.groupname}
            />
          )}
        </View>

        {/* Complaint Sub-Type */}
        {selectedCategory && (
          <View style={styles.inputGroup}>
            {loadingSubTypes ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#016ACD" />
                <ThemedText style={styles.loadingText}>Loading sub-types...</ThemedText>
              </View>
            ) : (
              <SimpleDropdown<ComplaintSubType>
                label="Complaint Sub-Type *"
                placeholder="-- Select Complaint Sub-Type --"
                value={selectedSubType}
                onSelect={(subType) => {
                  setSelectedSubType(subType);
                  if (errors.subType) setErrors({ ...errors, subType: '' });
                }}
                options={subTypes.map(subType => ({
                  value: subType,
                  label: subType.complaintname,
                }))}
                error={errors.subType}
                getLabel={(subType) => subType.complaintname}
              />
            )}
          </View>
        )}

        {/* Details of Complaint */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Details of Complaint *</ThemedText>
          <TextInput
            style={[styles.textArea, errors.details && styles.inputError]}
            value={complaintDetails}
            onChangeText={(text) => {
              setComplaintDetails(text);
              if (errors.details) setErrors({ ...errors, details: '' });
            }}
            placeholder="Please provide detailed information about the complaint..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          {errors.details && <ThemedText style={styles.errorText}>{errors.details}</ThemedText>}
        </View>

        {/* Upload Photo */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Upload Photo</ThemedText>
          <ThemedText style={styles.helperText}>Note: Upload Photo Less Than 1MB.</ThemedText>

          {photoUri ? (
            <View style={styles.photoPreview}>
              <Image source={{ uri: photoUri }} style={styles.photoImage} />
              <Pressable style={styles.removePhotoButton} onPress={handleRemovePhoto}>
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </Pressable>
            </View>
          ) : (
            <View style={styles.photoUploadContainer}>
              <Pressable style={styles.photoUploadButton} onPress={handleTakePhoto}>
                <Ionicons name="camera-outline" size={32} color="#9CA3AF" />
                <ThemedText style={styles.photoUploadText}>Take Photo</ThemedText>
              </Pressable>
              <Pressable style={styles.photoUploadButton} onPress={handleSelectFromGallery}>
                <Ionicons name="images-outline" size={32} color="#9CA3AF" />
                <ThemedText style={styles.photoUploadText}>Select Photo</ThemedText>
              </Pressable>
            </View>
          )}
        </View>
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
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 120,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#016ACD',
  },
  photoUploadContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  photoUploadButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  photoUploadText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  photoPreview: {
    width: 150,
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
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
