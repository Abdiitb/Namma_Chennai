import { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    TextInput,
    Image,
    Alert as RNAlert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { AuthInput } from '@/components/auth-input';
import { AuthButton } from '@/components/auth-button';
import { Alert } from '@/components/alert';
import { Ionicons } from '@expo/vector-icons';
import { useAuthState } from '@/hooks/use-auth';
import { Icon } from 'react-native-screens';
import { mutators } from '@/zero/mutators';
import { useZero } from '@rocicorp/zero/react';
import { schema } from '@/zero/schema';
import * as ImagePicker from 'expo-image-picker';

// Categories from schema
const CATEGORIES = [
    { id: 'water', label: 'Water', icon: 'water-outline', color: '#06B6D4' },
    { id: 'electricity', label: 'Electricity', icon: 'flash-outline', color: '#F59E0B' },
    { id: 'sanitation', label: 'Garbage', icon: 'trash-outline', color: '#EC4899' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline', color: '#667187' },
];

export default function CreateTicketScreen() {
    const { user } = useAuthState();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [addressText, setAddressText] = useState('');
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
        category?: string;
        address?: string;
    }>({});
    const [showSuccess, setShowSuccess] = useState(false);
    const zero = useZero();

    // Request camera permissions
    const requestCameraPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            RNAlert.alert(
                'Permission Required',
                'Camera permission is required to take photos.',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    // Request media library permissions
    const requestMediaLibraryPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            RNAlert.alert(
                'Permission Required',
                'Media library permission is required to select photos.',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    // Take photo with camera
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
                setPhotos([...photos, result.assets[0].uri]);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            RNAlert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    // Select photo from gallery
    const handleSelectFromGallery = async () => {
        const hasPermission = await requestMediaLibraryPermission();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                selectionLimit: 5 - photos.length, // Max 5 photos total
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
                const newPhotos = result.assets.map(asset => asset.uri);
                setPhotos([...photos, ...newPhotos].slice(0, 5)); // Ensure max 5 photos
            }
        } catch (error) {
            console.error('Error selecting photos:', error);
            RNAlert.alert('Error', 'Failed to select photos. Please try again.');
        }
    };

    // Remove photo
    const handleRemovePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!category) newErrors.category = 'Please select a category';
        if (!title.trim()) newErrors.title = 'Title is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        if (!addressText.trim()) newErrors.address = 'Location is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        setError('');
        try {
            // TODO: Upload photos to your storage service (e.g., AWS S3, Firebase Storage)
            // and get URLs. For now, using local URIs as placeholder
            const attachmentUrls = photos; // Replace with actual uploaded URLs

            const ticketData = {
                id: `TKT-${Date.now()}`,
                created_by: user?.id || '4c8d7866-be1c-4b5d-8cb1-71a9a5a09d7f',
                category,
                title: title.trim(),
                description: description.trim(),
                address_text: addressText.trim(),
                lat,
                lng,
                status: 'open',
                assigned_to: null,
                current_supervisor: null,
                citizen_rating: null,
                citizen_feedback: null,
                created_at: Date.now(),
                updated_at: Date.now(),
                closed_at: null,
            };

            console.log('Creating ticket:', ticketData);

            zero.mutate(
                mutators.createTicket({
                    created_by: ticketData.created_by,
                    category: ticketData.category,
                    title: ticketData.title,
                    description: ticketData.description,
                    address_text: ticketData.address_text,
                    lat: ticketData.lat,
                    lng: ticketData.lng,
                    attachmentUrls,
                })
            );

            setShowSuccess(true);
            setTimeout(() => {
                router.back();
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Success Card */}
            {showSuccess && (
                <View style={styles.successCard}>
                    <Ionicons name="checkmark-circle" size={32} color="#10B981" style={{ marginBottom: 8 }} />
                    <ThemedText style={styles.successText}>Ticket created successfully!</ThemedText>
                </View>
            )}

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#1F2937" />
                </Pressable>
                <ThemedText style={styles.headerTitle}>Report Issue</ThemedText>
                <View style={styles.placeholder} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Progress Indicator */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressStep}>
                            <View style={[styles.progressDot, styles.progressDotActive]} />
                            <ThemedText style={styles.progressLabel}>Details</ThemedText>
                        </View>
                        <View style={styles.progressLine} />
                        <View style={styles.progressStep}>
                            <View style={styles.progressDot} />
                            <ThemedText style={styles.progressLabel}>Review</ThemedText>
                        </View>
                    </View>

                    {error && (
                        <Alert
                            message={error}
                            type="error"
                            onDismiss={() => setError('')}
                        />
                    )}

                    {/* Category Selection */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Select Category *</ThemedText>
                        {errors.category && (
                            <ThemedText style={styles.errorText}>{errors.category}</ThemedText>
                        )}
                        <View style={styles.categoriesGrid}>
                            {CATEGORIES.map((cat) => (
                                <Pressable
                                    key={cat.id}
                                    style={[
                                        styles.categoryCard,
                                        category === cat.id && styles.categoryCardSelected,
                                    ]}
                                    onPress={() => setCategory(cat.id)}
                                >
                                    <View
                                        style={[
                                            styles.categoryIcon,
                                            { backgroundColor: cat.color + '20' },
                                            category === cat.id && {
                                                borderColor: cat.color,
                                                borderWidth: 2,
                                            },
                                        ]}
                                    >
                                        <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                                    </View>
                                    <ThemedText
                                        style={[
                                            styles.categoryLabel,
                                            category === cat.id && { color: cat.color },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {cat.label}
                                    </ThemedText>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Title */}
                    <View style={styles.section}>
                        <AuthInput
                            label="Issue Title *"
                            placeholder="Brief title for your issue"
                            value={title}
                            onChangeText={setTitle}
                            error={errors.title}
                            autoCapitalize="sentences"
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <ThemedText style={styles.label}>Description *</ThemedText>
                        <View style={[styles.textAreaContainer, errors.description && styles.inputError]}>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Please provide detailed information about the issue..."
                                placeholderTextColor="#9CA3AF"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                            />
                        </View>
                        {errors.description && (
                            <ThemedText style={styles.errorText}>{errors.description}</ThemedText>
                        )}
                        <ThemedText style={styles.charCount}>
                            {description.length}/500 characters
                        </ThemedText>
                    </View>

                    {/* Location */}
                    <View style={styles.section}>
                        <AuthInput
                            label="Location *"
                            placeholder="Enter address or landmark"
                            value={addressText}
                            onChangeText={setAddressText}
                            error={errors.address}
                        />
                        <Pressable style={styles.locationButton}>
                            <Ionicons name="location-outline" size={18} color="#6366F1" />
                            <ThemedText style={styles.locationButtonText}>
                                Use Current Location
                            </ThemedText>
                        </Pressable>
                    </View>

                    {/* Photo Upload */}
                    <View style={styles.section}>
                        <ThemedText style={styles.label}>
                            Add Photos (Optional) {photos.length > 0 && `(${photos.length}/5)`}
                        </ThemedText>
                        
                        {/* Photo Preview Grid */}
                        {photos.length > 0 && (
                            <View style={styles.photoPreviewContainer}>
                                {photos.map((uri, index) => (
                                    <View key={index} style={styles.photoPreview}>
                                        <Image source={{ uri }} style={styles.photoImage} />
                                        <Pressable
                                            style={styles.removePhotoButton}
                                            onPress={() => handleRemovePhoto(index)}
                                        >
                                            <Ionicons name="close-circle" size={24} color="#EF4444" />
                                        </Pressable>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Upload Buttons */}
                        {photos.length < 5 && (
                            <View style={styles.photoUploadContainer}>
                                <Pressable 
                                    style={styles.photoUploadButton}
                                    onPress={handleTakePhoto}
                                >
                                    <Ionicons name="camera-outline" size={28} color="#6366F1" />
                                    <ThemedText style={styles.photoUploadText}>Take Photo</ThemedText>
                                </Pressable>
                                <Pressable 
                                    style={styles.photoUploadButton}
                                    onPress={handleSelectFromGallery}
                                >
                                    <Ionicons name="images-outline" size={28} color="#6366F1" />
                                    <ThemedText style={styles.photoUploadText}>Gallery</ThemedText>
                                </Pressable>
                            </View>
                        )}
                    </View>

                    {/* Submit Button */}
                    <View style={styles.submitContainer}>
                        <AuthButton
                            title="Submit Report"
                            onPress={handleSubmit}
                            loading={loading}
                        />
                        <ThemedText style={styles.disclaimer}>
                            By submitting, you confirm that the information provided is accurate
                        </ThemedText>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    placeholder: {
        width: 40,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    progressStep: {
        alignItems: 'center',
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        marginBottom: 4,
    },
    progressDotActive: {
        backgroundColor: '#6366F1',
    },
    progressLine: {
        width: 60,
        height: 2,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 8,
        marginBottom: 16,
    },
    progressLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
    },
    categoryCard: {
        width: '25%',
        padding: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
        alignItems: 'center',
    },
    categoryCardSelected: {
        transform: [{ scale: 1.05 }],
    },
    categoryIcon: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoryLabel: {
        fontSize: 11,
        color: '#6B7280',
        textAlign: 'center',
        fontWeight: '500',
    },
    textAreaContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    textArea: {
        height: 120,
        padding: 14,
        fontSize: 15,
        color: '#1F2937',
    },
    inputError: {
        borderColor: '#EF4444',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
    },
    charCount: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'right',
        marginTop: 4,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },
    locationButtonText: {
        fontSize: 14,
        color: '#6366F1',
        fontWeight: '500',
    },
    photoPreviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 12,
    },
    photoPreview: {
        width: 100,
        height: 100,
        borderRadius: 12,
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
    photoUploadContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    photoUploadButton: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        paddingVertical: 24,
        alignItems: 'center',
        gap: 8,
    },
    photoUploadText: {
        fontSize: 13,
        color: '#6366F1',
        fontWeight: '500',
    },
    submitContainer: {
        marginTop: 8,
    },
    disclaimer: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 18,
    },
    successCard: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        zIndex: 100,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#D1FAE5',
        flexDirection: 'column',
        gap: 4,
    },
    successText: {
        fontSize: 16,
        color: '#10B981',
        fontWeight: '600',
        textAlign: 'center',
    },
});