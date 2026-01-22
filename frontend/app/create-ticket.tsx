import { useState, useRef, useEffect } from 'react';
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
    ActivityIndicator,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { AuthInput } from '@/components/auth-input';
import { AuthButton } from '@/components/auth-button';
import { LocationInput } from '@/components/location-input';
import { CategoryDropdown } from '@/components/category-dropdown';
import { Alert } from '@/components/alert';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/auth-context';
import { mutators } from '@/zero/mutators';
import { useZero } from '@rocicorp/zero/react';
import { schema } from '@/zero/schema';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '@/constants/api';

// Categories from schema
const CATEGORIES = [
    { id: 'water issue', label: 'water issue', icon: 'water-outline', color: '#06B6D4' },
    { id: 'electricity issue', label: 'electricity issue', icon: 'flash-outline', color: '#F59E0B' },
    { id: 'garbage issue', label: 'garbage issue', icon: 'trash-outline', color: '#EC4899' },
    { id: 'other issues', label: 'other issues', icon: 'ellipsis-horizontal-outline', color: '#667187' },
];

export default function CreateTicketScreen() {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [addressText, setAddressText] = useState('');
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [classifyingImages, setClassifyingImages] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
        category?: string;
        address?: string;
    }>({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [successTicketData, setSuccessTicketData] = useState<any>(null);
    const [analyzingImage, setAnalyzingImage] = useState(false);
    const [currentImageAnalyzing, setCurrentImageAnalyzing] = useState('');
    const zero = useZero();
    const descriptionAtStart = useRef('');
    const recognitionRef = useRef<any>(null);

    // Setup speech recognition events using hooks
    // useSpeechRecognitionEvent('start', () => {
    //     console.log('Speech recognition started');
    //     setIsListening(true);
    // });

    // useSpeechRecognitionEvent('end', () => {
    //     console.log('Speech recognition ended');
    //     setIsListening(false);
    // });

    // useSpeechRecognitionEvent('result', (event) => {
    //     console.log('Speech result:', event);
    //     if (event.results && event.results.length > 0) {
    //         const transcript = event.results[0]?.transcript || '';
    //         if (transcript) {
    //             const combinedText = descriptionAtStart.current
    //                 ? `${descriptionAtStart.current.trim()} ${transcript.trim()}`
    //                 : transcript.trim();

    //             setDescription(combinedText.slice(0, 500));
    //             console.log('Transcribed text:', combinedText);
    //         }
    //     }
    // });

    // useSpeechRecognitionEvent('error', (event) => {
    //     console.error('Speech recognition error:', event.error, event.message);
    //     setIsListening(false);
    //     RNAlert.alert('Error', `Speech recognition failed: ${event.message}`);
    // });

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
                const newPhotos = [...photos, result.assets[0].uri];
                setPhotos(newPhotos);
                classifyFirstImage(newPhotos);
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
                selectionLimit: 5 - photos.length,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
                const newPhotos = result.assets.map(asset => asset.uri);
                const updatedPhotos = [...photos, ...newPhotos].slice(0, 5);
                setPhotos(updatedPhotos);
                
                if (updatedPhotos.length > 0) {
                    classifyFirstImage(updatedPhotos);
                }
            }
        } catch (error) {
            console.error('Error selecting photos:', error);
            RNAlert.alert('Error', 'Failed to select photos. Please try again.');
        }
    };

    // Classify image using AI endpoint
    const classifyFirstImage = async (photoUris: string[]) => {
        if (photoUris.length === 0 || photos.length > 1) return;

        setAnalyzingImage(true);
        setCurrentImageAnalyzing(photoUris[0]);
        try {
            const imageUri = photoUris[0]; // Classify the first image

            // Convert image URI to base64
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onload = async () => {
                const base64String = reader.result as string;

                try {
            // Send to classification endpoint
            const classifyResponse = await fetch(`${API_BASE_URL}/api/ai/classify-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                            image: base64String,
                }),
            });

            if (classifyResponse.ok) {
                const result = await classifyResponse.json();
                console.log('Classification result:', result);
                
                // Set category from API result
                if (result.category) {
                    setCategory(result.category);
                    console.log('Category set to:', result.category);
                }

                // Set title if not already provided
                if (result.title && !title) {
                    setTitle(result.title);
                    console.log('Title set to:', result.title);
                }
                
                // Set description if not already provided
                if (result.description && !description) {
                    setDescription(result.description);
                    console.log('Description set to:', result.description);
                }

                // Show success for 1 second then dismiss
                setTimeout(() => {
                    setAnalyzingImage(false);
                    setCurrentImageAnalyzing('');
                    RNAlert.alert(
                        'Image Analyzed Successfully',
                        `Category: ${result.category || 'Unknown'}\n\nYou can review and edit the details below.`,
                        [{ text: 'OK' }]
                    );
                }, 1000);

            } else {
                        console.warn('Classification failed:', classifyResponse.statusText);
                        setAnalyzingImage(false);
                        setCurrentImageAnalyzing('');
                        RNAlert.alert('Analysis Failed', 'Could not analyze the image. Please try again.');
            }
        } catch (err) {
            console.warn('Error classifying image:', err);
                    setAnalyzingImage(false);
                    setCurrentImageAnalyzing('');
                    RNAlert.alert('Error', 'Failed to analyze image. Please try again.');
        }
    };

            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Error preparing image for classification:', error);
            setAnalyzingImage(false);
            setCurrentImageAnalyzing('');
        }
    };





    const handleVoiceInput = async () => {
        try {
            if (Platform.OS === 'web') {
                // Web implementation using Web Speech API
                const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

                if (!SpeechRecognition) {
                    RNAlert.alert('Not Supported', 'Speech recognition is not supported on your browser');
                    return;
                }

                if (isListening) {
                    const recognition = (window as any).currentRecognition;
                    recognition?.stop();
                    setIsListening(false);
                    return;
                }

                descriptionAtStart.current = description;
                setIsListening(true);

                const recognition = new SpeechRecognition();
                (window as any).currentRecognition = recognition;

                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    console.log('Speech recognition started');
                };

                recognition.onresult = (event: any) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }

                    const combinedText = descriptionAtStart.current
                        ? `${descriptionAtStart.current.trim()} ${transcript.trim()}`
                        : transcript.trim();

                    setDescription(combinedText.slice(0, 500));
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognition.start();
            } else {
                // Mobile implementation using ExpoSpeechRecognitionModule
                if (isListening) {
                    try {
                        await ExpoSpeechRecognitionModule.stop();
                        setIsListening(false);
                    } catch (error) {
                        console.error('Error stopping speech:', error);
                        setIsListening(false);
                    }
                    return;
                }

                descriptionAtStart.current = description;

                try {
                    // Request permissions first
                    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
                    
                    if (!result.granted) {
                        RNAlert.alert(
                            'Permission Required',
                            'Microphone permission is required for voice input',
                            [{ text: 'OK' }]
                        );
                        return;
                    }

                    // Start speech recognition
                    await ExpoSpeechRecognitionModule.start({
                        lang: 'en-US',
                        interimResults: true,
                        continuous: false,
                    });
                } catch (error) {
                    console.error('Error starting speech recognition:', error);
                    setIsListening(false);
                    
                    if (error instanceof Error) {
                        RNAlert.alert('Error', error.message || 'Failed to start speech recognition');
                    }
                }
            }
        } catch (error) {
            console.error('Error in handleVoiceInput:', error);
            setIsListening(false);
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
            const attachmentUrls = photos;
            const ticketId = `TKT-${Date.now()}`;

            const ticketData = {
                id: ticketId,
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

            setSuccessTicketData(ticketData);
            setShowSuccess(true);
            setTimeout(() => {
                router.replace('/(tabs)/issues');
            }, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        router.replace('/');
    };

    // Helper function to get category color
    const getCategoryColor = (cat: string): string => {
        const categoryMap: { [key: string]: string } = {
            'water issue': '#06B6D4',
            'electricity issue': '#F59E0B',
            'garbage issue': '#EC4899',
            'other issues': '#667187',
        };
        return categoryMap[cat] || '#667187';
    };

    // Helper function to get category icon
    const getCategoryIcon = (cat: string): string => {
        const iconMap: { [key: string]: string } = {
            'water issue': 'water-outline',
            'electricity issue': 'flash-outline',
            'garbage issue': 'trash-outline',
            'other issues': 'ellipsis-horizontal-outline',
        };
        return iconMap[cat] || 'ellipsis-horizontal-outline';
    };

    // Success Screen
    if (showSuccess && successTicketData) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.successScreenContainer}>
                    <ScrollView
                        contentContainerStyle={styles.successScrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Success Icon */}
                        <View style={styles.successIconContainer}>
                            <Ionicons name="checkmark-circle" size={100} color="#10B981" />
                        </View>

                        {/* Success Messages */}
                        <ThemedText style={styles.successTitle}>Ticket Raised.</ThemedText>
                        <ThemedText style={styles.successSubtitle}>We will get back to you</ThemedText>

                        {/* Ticket Info Card */}
                        <View style={styles.ticketInfoCard}>
                            {/* Ticket Header with Icon and Title */}
                            <View style={styles.ticketInfoRow}>
                                <View style={[
                                    styles.ticketIconBg,
                                    { backgroundColor: getCategoryColor(successTicketData.category) + '30' }
                                ]}>
                                    <Ionicons
                                        name={getCategoryIcon(successTicketData.category) as any}
                                        size={28}
                                        color={getCategoryColor(successTicketData.category)}
                                    />
                                </View>
                                <View style={styles.ticketTitleSection}>
                                    <ThemedText style={styles.ticketTitle}>
                                        {successTicketData.title}
                                    </ThemedText>
                                    <ThemedText style={styles.ticketLocation} numberOfLines={2}>
                                        {successTicketData.address_text}
                                    </ThemedText>
                                </View>
                            </View>

                            {/* Divider */}
                            <View style={styles.ticketDivider} />

                            {/* Ticket Details */}
                            <View style={styles.ticketDetailsSection}>
                                {/* Status */}
                                <View style={styles.ticketDetailRow}>
                                    <ThemedText style={styles.ticketDetailLabel}>Status:</ThemedText>
                                    <ThemedText style={[styles.ticketDetailValue, { color: '#10B981', fontWeight: '600' }]}>
                                        Opened
                                    </ThemedText>
                                </View>

                                {/* Last Updated */}
                                <View style={styles.ticketDetailRow}>
                                    <ThemedText style={styles.ticketDetailLabel}>Last Updated:</ThemedText>
                                    <ThemedText style={styles.ticketDetailValue}>
                                        {new Date(successTicketData.created_at).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })} | {new Date(successTicketData.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </ThemedText>
                                </View>

                                {/* Expected Resolution */}
                                <View style={styles.ticketDetailRow}>
                                    <ThemedText style={styles.ticketDetailLabel}>Expected resolution:</ThemedText>
                                    <ThemedText style={styles.ticketDetailValue}>48 hours</ThemedText>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Back to Home Button */}
                    <View style={styles.successButtonContainer}>
                        <AuthButton
                            title="Back to home"
                            onPress={handleClose}
                            style={{ backgroundColor: '#1F2937' }}
                            textColor="#FFFFFF"
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }



    // Form Screen
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleClose} style={styles.closeButton}>
                    <Ionicons name="chevron-back" size={24} color="#1F2937" />
                </Pressable>
                <ThemedText style={styles.headerTitle}>
                    {title || 'New Issue'}
                </ThemedText>
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
                    {error && (
                        <Alert
                            message={error}
                            type="error"
                            onDismiss={() => setError('')}
                        />
                    )}

                    {/* Category Dropdown */}
                    <View style={styles.section}>
                        <CategoryDropdown
                            label="Category"
                            placeholder="Select a category"
                            value={category}
                            onSelect={setCategory}
                            categories={CATEGORIES}
                            error={errors.category}
                        />
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

                    {/* Location Section */}
                    <View style={styles.sectionWithHeader}>
                        <ThemedText style={styles.sectionHeader}>Location Details</ThemedText>
                        <View style={styles.sectionContent}>
                            <LocationInput
                                value={addressText}
                                onLocationSelect={(address, latitude, longitude) => {
                                    setAddressText(address);
                                    setLat(latitude || null);
                                    setLng(longitude || null);
                                }}
                                error={errors.address}
                                placeholder="Search for address or landmark"
                            />
                        </View>
                    </View>

                    {/* Description Section */}
                    <View style={styles.sectionWithHeader}>
                        <View style={styles.labelWithButton}>
                            <ThemedText style={styles.sectionHeader}>Issue Description</ThemedText>
                            <Pressable 
                                style={[
                                    styles.voiceButton,
                                    isListening && styles.voiceButtonActive
                                ]}
                                onPress={handleVoiceInput}
                            >
                                <Ionicons 
                                    name={isListening ? "stop-circle" : "mic-outline"} 
                                    size={16} 
                                    color={isListening ? "#fff" : "#6366F1"} 
                                />
                                <ThemedText style={[
                                    styles.voiceButtonText,
                                    isListening && styles.voiceButtonTextActive
                                ]}>
                                    {isListening ? 'Stop' : 'Voice'}
                                </ThemedText>
                            </Pressable>
                        </View>
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

                    {/* Photo Upload */}
                    <View style={styles.sectionWithHeader}>
                        <ThemedText style={styles.sectionHeader}>
                            Add a photo (optional)
                        </ThemedText>
                        
                        {/* Photo Preview Grid */}
                        {photos.length > 0 && (
                            <View style={styles.photoPreviewContainer}>
                                {photos.map((uri, index) => (
                                    <View key={index} style={styles.photoPreview}>
                                        <Image source={{ uri }} style={styles.photoImage} />
                                        
                                        {/* Small Analyzing Overlay */}
                                        {analyzingImage && currentImageAnalyzing === uri && (
                                            <View style={styles.analyzingOverlay}>
                                                <ActivityIndicator size="small" color="#F59E0B" />
                                                <ThemedText style={styles.analyzingOverlayText}>Analyzing...</ThemedText>
                                            </View>
                                        )}
                                        
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
                                    style={[
                                        styles.photoUploadButton,
                                        classifyingImages && { opacity: 0.6 }
                                    ]}
                                    onPress={handleSelectFromGallery}
                                    disabled={classifyingImages}
                                >
                                    <Ionicons name="images-outline" size={48} color="#9CA3AF" />
                                    <ThemedText style={styles.photoUploadText}>Select Photos</ThemedText>
                                </Pressable>
                            </View>
                        )}
                    </View>

                    {/* Submit Button */}
                    <View style={styles.submitContainer}>
                        <AuthButton
                            title="Send My Complaint"
                            onPress={handleSubmit}
                            loading={loading}
                            style={{ backgroundColor: '#016ACD', flex: 1 }}
                            textColor="#fff"
                            
                        />
                        <ThemedText style={[styles.disclaimer, { color: '#fff' }]}>
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
        padding: 24,
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
    labelWithButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    voiceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    voiceButtonActive: {
        backgroundColor: '#6366F1',
        borderColor: '#6366F1',
    },
    voiceButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6366F1',
    },
    voiceButtonTextActive: {
        color: '#fff',
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
        paddingVertical: 40,
        alignItems: 'center',
        gap: 12,
    },
    photoUploadText: {
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    sectionWithHeader: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0866D8',
        marginBottom: 12,
    },
    sectionContent: {
        marginTop: 8,
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
    // Success Screen Styles
    successScreenContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    successScrollContent: {
        paddingBottom: 20,
    },
    successIconContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#10B981',
        textAlign: 'center',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#10B981',
        textAlign: 'center',
        marginBottom: 32,
    },
    ticketInfoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    ticketInfoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    ticketIconBg: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        flexShrink: 0,
    },
    ticketTitleSection: {
        flex: 1,
        justifyContent: 'center',
    },
    ticketTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    ticketLocation: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    ticketDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    ticketDetailsSection: {
        gap: 12,
    },
    ticketDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ticketDetailLabel: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    ticketDetailValue: {
        fontSize: 13,
        color: '#1F2937',
        fontWeight: '500',
    },
    successButtonContainer: {
        paddingBottom: 16,
    },
    // Analyzing Overlay Styles (Small)
    analyzingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    analyzingOverlayText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    // Analyzing Image Screen Styles (Removed - now using small overlay)
    analyzingScreenContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    analyzingImagePreview: {
        width: 280,
        height: 280,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    analyzingImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    analyzingContent: {
        alignItems: 'center',
        gap: 12,
    },
    analyzingTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
    },
    analyzingSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },
});
