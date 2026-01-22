import { useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    ActivityIndicator,
    Alert as RNAlert,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '@/constants/api';

type AnalysisResult = {
    category: string;
    title: string;
    description: string;
    confidence?: string;
};

export default function UploadAndAnalyzeScreen() {
    const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

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

    // Handle file upload
    const handleFileUpload = async () => {
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
                const imageUri = result.assets[0].uri;
                setUploadedImageUri(imageUri);
                // Start analysis immediately after upload
                await analyzeImage(imageUri);
            }
        } catch (error) {
            console.error('Error selecting photo:', error);
            RNAlert.alert('Error', 'Failed to select photo. Please try again.');
        }
    };

    // Handle camera capture
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
                const imageUri = result.assets[0].uri;
                setUploadedImageUri(imageUri);
                // Start analysis immediately after capture
                await analyzeImage(imageUri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            RNAlert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    // Analyze image using AI endpoint
    const analyzeImage = async (imageUri: string) => {
        setIsAnalyzing(true);
        try {
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
                        setAnalysisResult(result);
                        
                        // Navigate to form screen with pre-filled data
                        setTimeout(() => {
                            router.replace({
                                pathname: '/create-ticket',
                                params: {
                                    category: result.category || '',
                                    title: result.title || '',
                                    description: result.description || '',
                                    imageUri: imageUri,
                                },
                            });
                        }, 500); // Small delay to show completion
                    } else {
                        console.warn('Classification failed:', classifyResponse.statusText);
                        setIsAnalyzing(false);
                        RNAlert.alert(
                            'Analysis Failed',
                            'Could not analyze the image. You can still proceed to create a complaint.',
                            [
                                { text: 'Cancel', style: 'cancel', onPress: () => router.back() },
                                {
                                    text: 'Continue',
                                    onPress: () => {
                                        router.replace({
                                            pathname: '/create-ticket',
                                            params: {
                                                imageUri: imageUri,
                                            },
                                        });
                                    },
                                },
                            ]
                        );
                    }
                } catch (err) {
                    console.warn('Error classifying image:', err);
                    setIsAnalyzing(false);
                    RNAlert.alert(
                        'Error',
                        'Failed to analyze image. You can still proceed to create a complaint.',
                        [
                            { text: 'Cancel', style: 'cancel', onPress: () => router.back() },
                            {
                                text: 'Continue',
                                onPress: () => {
                                    router.replace({
                                        pathname: '/create-ticket',
                                        params: {
                                            imageUri: imageUri,
                                        },
                                    });
                                },
                            },
                        ]
                    );
                }
            };

            reader.onerror = () => {
                console.error('Error reading image file');
                setIsAnalyzing(false);
                RNAlert.alert('Error', 'Failed to process image. Please try again.');
            };

            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Error preparing image for classification:', error);
            setIsAnalyzing(false);
            RNAlert.alert('Error', 'Failed to prepare image for analysis. Please try again.');
        }
    };

    // Show file upload options if no image uploaded yet
    if (!uploadedImageUri && !isAnalyzing) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <ThemedText style={styles.headerTitle}>Upload Photo</ThemedText>
                </View>
                <View style={styles.content}>
                    <View style={styles.uploadOptions}>
                        <ThemedText style={styles.instructionText}>
                            Select a photo to analyze the issue
                        </ThemedText>
                        
                        <View style={styles.buttonContainer}>
                            <Pressable style={styles.uploadButton} onPress={handleFileUpload}>
                                <Ionicons name="images-outline" size={48} color="#2196F3" />
                                <ThemedText style={styles.uploadButtonText}>Choose from Gallery</ThemedText>
                            </Pressable>
                            
                            <Pressable style={styles.uploadButton} onPress={handleTakePhoto}>
                                <Ionicons name="camera-outline" size={48} color="#2196F3" />
                                <ThemedText style={styles.uploadButtonText}>Take Photo</ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // Show analyzing screen
    if (isAnalyzing && uploadedImageUri) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.analyzingContainer}>
                    <View style={styles.analyzingContent}>
                        {/* Large circular orange loader */}
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#F59E0B" />
                        </View>
                        
                        {/* Title */}
                        <ThemedText style={styles.analyzingTitle}>Analyzing the issue...</ThemedText>
                        
                        {/* Subtitle */}
                        <ThemedText style={styles.analyzingSubtitle}>
                            Identifying problem type and location
                        </ThemedText>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    uploadOptions: {
        width: '100%',
        alignItems: 'center',
    },
    instructionText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    uploadButton: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        paddingVertical: 40,
        alignItems: 'center',
        gap: 12,
    },
    uploadButtonText: {
        fontSize: 16,
        color: '#2196F3',
        fontWeight: '500',
    },
    analyzingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#FFFFFF',
    },
    analyzingContent: {
        alignItems: 'center',
        gap: 16,
    },
    loaderContainer: {
        marginBottom: 24,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    analyzingTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
    },
    analyzingSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
    },
});
