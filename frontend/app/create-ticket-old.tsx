// import { useState, useRef, useEffect } from 'react';
// import {
//     StyleSheet,
//     View,
//     ScrollView,
//     KeyboardAvoidingView,
//     Platform,
//     Pressable,
//     TextInput,
//     Image,
//     Alert as RNAlert,
//     ActivityIndicator,
//     Dimensions,
// } from 'react-native';
// import * as FileSystem from 'expo-file-system/legacy';
// import * as ImageManipulator from 'expo-image-manipulator';
// import {
//     ExpoSpeechRecognitionModule,
//     useSpeechRecognitionEvent,
// } from 'expo-speech-recognition';

// import { router } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ThemedText } from '@/components/themed-text';
// import { AuthInput } from '@/components/auth-input';
// import { AuthButton } from '@/components/auth-button';
// import { LocationInput } from '@/components/location-input';
// import { Alert } from '@/components/alert';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '@/context/auth-context';
// import { mutators } from '@/zero/mutators';
// import { useZero } from '@rocicorp/zero/react';
// import { schema } from '@/zero/schema';
// import * as ImagePicker from 'expo-image-picker';
// import { API_BASE_URL } from '@/constants/api';

// // Categories from schema
// const CATEGORIES = [
//     { id: 'water', label: 'Water', icon: 'water-outline', color: '#06B6D4' },
//     { id: 'electricity', label: 'Electricity', icon: 'flash-outline', color: '#F59E0B' },
//     { id: 'sanitation', label: 'Garbage', icon: 'trash-outline', color: '#EC4899' },
//     { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline', color: '#667187' },
// ];

// export default function CreateTicketScreen() {
//     const { user } = useAuth();
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [category, setCategory] = useState('');
//     const [addressText, setAddressText] = useState('');
//     const [lat, setLat] = useState<number | null>(null);
//     const [lng, setLng] = useState<number | null>(null);
//     const [photos, setPhotos] = useState<string[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [classifyingImages, setClassifyingImages] = useState(false);
//     const [isListening, setIsListening] = useState(false);
//     const [errors, setErrors] = useState<{
//         title?: string;
//         description?: string;
//         category?: string;
//         address?: string;
//     }>({});
//     const [showSuccess, setShowSuccess] = useState(false);
//     const zero = useZero();
//     const descriptionAtStart = useRef('');
//     const recognitionRef = useRef<any>(null);

//     // Setup speech recognition events using hooks
//     useSpeechRecognitionEvent('start', () => {
//         console.log('Speech recognition started');
//         setIsListening(true);
//     });

//     useSpeechRecognitionEvent('end', () => {
//         console.log('Speech recognition ended');
//         setIsListening(false);
//     });

//     useSpeechRecognitionEvent('result', (event) => {
//         console.log('Speech result:', event);
//         if (event.results && event.results.length > 0) {
//             const transcript = event.results[0]?.transcript || '';
//             if (transcript) {
//                 const combinedText = descriptionAtStart.current
//                     ? `${descriptionAtStart.current.trim()} ${transcript.trim()}`
//                     : transcript.trim();

//                 setDescription(combinedText.slice(0, 500));
//                 console.log('Transcribed text:', combinedText);
//             }
//         }
//     });

//     useSpeechRecognitionEvent('error', (event) => {
//         console.error('Speech recognition error:', event.error, event.message);
//         setIsListening(false);
//         RNAlert.alert('Error', `Speech recognition failed: ${event.message}`);
//     });

//     // Request camera permissions
//     const requestCameraPermission = async () => {
//         const { status } = await ImagePicker.requestCameraPermissionsAsync();
//         if (status !== 'granted') {
//             RNAlert.alert(
//                 'Permission Required',
//                 'Camera permission is required to take photos.',
//                 [{ text: 'OK' }]
//             );
//             return false;
//         }
//         return true;
//     };

//     // Request media library permissions
//     const requestMediaLibraryPermission = async () => {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//             RNAlert.alert(
//                 'Permission Required',
//                 'Media library permission is required to select photos.',
//                 [{ text: 'OK' }]
//             );
//             return false;
//         }
//         return true;
//     };

//     // Take photo with camera
//     const handleTakePhoto = async () => {
//         const hasPermission = await requestCameraPermission();
//         if (!hasPermission) return;

//         try {
//             const result = await ImagePicker.launchCameraAsync({
//                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                 allowsEditing: true,
//                 aspect: [4, 3],
//                 quality: 0.8,
//             });

//             if (!result.canceled && result.assets[0]) {
//                 const newPhotos = [...photos, result.assets[0].uri];
//                 setPhotos(newPhotos);
//                 classifyFirstImage(newPhotos);
//             }
//         } catch (error) {
//             console.error('Error taking photo:', error);
//             RNAlert.alert('Error', 'Failed to take photo. Please try again.');
//         }
//     };

//     // Select photo from gallery
//     const handleSelectFromGallery = async () => {
//         const hasPermission = await requestMediaLibraryPermission();
//         if (!hasPermission) return;

//         try {
//             const result = await ImagePicker.launchImageLibraryAsync({
//                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                 allowsMultipleSelection: true,
//                 selectionLimit: 5 - photos.length,
//                 aspect: [4, 3],
//                 quality: 0.8,
//             });

//             if (!result.canceled && result.assets.length > 0) {
//                 const newPhotos = result.assets.map(asset => asset.uri);
//                 const updatedPhotos = [...photos, ...newPhotos].slice(0, 5);
//                 setPhotos(updatedPhotos);
                
//                 if (updatedPhotos.length > 0) {
//                     classifyFirstImage(updatedPhotos);
//                 }
//             }
//         } catch (error) {
//             console.error('Error selecting photos:', error);
//             RNAlert.alert('Error', 'Failed to select photos. Please try again.');
//         }
//     };

//     // Classify image using AI endpoint
//     const classifyFirstImage = async (photoUris: string[]) => {
//         if (photoUris.length === 0 || photos.length > 1) return;

//         setClassifyingImages(true);
//         try {
//             const imageUri = photoUris[0]; // Classify the first image

//             // Convert image URI to base64
//             const response = await fetch(imageUri);
//             const blob = await response.blob();
//             const reader = new FileReader();

//             reader.onload = async () => {
//                 const base64String = reader.result as string;

//                 try {
//             // Send to classification endpoint
//             const classifyResponse = await fetch(`${API_BASE_URL}/api/ai/classify-image`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                             image: base64String,
//                 }),
//             });

//             if (classifyResponse.ok) {
//                 const result = await classifyResponse.json();
//                 console.log('Classification result:', result);
//                 if (result.category) {
//                     setCategory(result.category);
//                     RNAlert.alert(
//                         'Category Detected',
//                         `Image classified as: ${result.category}`,
//                         [{ text: 'OK' }]
//                     );
//                 }

//                 if (result.title && !title) {
//                     setTitle(result.title);
//                 }
//                 if (result.description && !description) {
//                     setDescription(result.description);
//                 }

//             } else {
//                         console.warn('Classification failed:', classifyResponse.statusText);
//             }
//         } catch (err) {
//             console.warn('Error classifying image:', err);
//                     // Don't show error to user - classification is optional
//         } finally {
//             setClassifyingImages(false);
//         }
//     };

//             reader.readAsDataURL(blob);
//         } catch (error) {
//             console.error('Error preparing image for classification:', error);
//             setClassifyingImages(false);
//         }
//     };





//     const handleVoiceInput = async () => {
//         try {
//             if (Platform.OS === 'web') {
//                 // Web implementation using Web Speech API
//                 const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

//                 if (!SpeechRecognition) {
//                     RNAlert.alert('Not Supported', 'Speech recognition is not supported on your browser');
//                     return;
//                 }

//                 if (isListening) {
//                     const recognition = (window as any).currentRecognition;
//                     recognition?.stop();
//                     setIsListening(false);
//                     return;
//                 }

//                 descriptionAtStart.current = description;
//                 setIsListening(true);

//                 const recognition = new SpeechRecognition();
//                 (window as any).currentRecognition = recognition;

//                 recognition.continuous = true;
//                 recognition.interimResults = true;
//                 recognition.lang = 'en-US';

//                 recognition.onstart = () => {
//                     console.log('Speech recognition started');
//                 };

//                 recognition.onresult = (event: any) => {
//                     let transcript = '';
//                     for (let i = event.resultIndex; i < event.results.length; i++) {
//                         transcript += event.results[i][0].transcript;
//                     }

//                     const combinedText = descriptionAtStart.current
//                         ? `${descriptionAtStart.current.trim()} ${transcript.trim()}`
//                         : transcript.trim();

//                     setDescription(combinedText.slice(0, 500));
//                 };

//                 recognition.onerror = (event: any) => {
//                     console.error('Speech recognition error:', event.error);
//                     setIsListening(false);
//                 };

//                 recognition.onend = () => {
//                     setIsListening(false);
//                 };

//                 recognition.start();
//             } else {
//                 // Mobile implementation using ExpoSpeechRecognitionModule
//                 if (isListening) {
//                     try {
//                         await ExpoSpeechRecognitionModule.stop();
//                         setIsListening(false);
//                     } catch (error) {
//                         console.error('Error stopping speech:', error);
//                         setIsListening(false);
//                     }
//                     return;
//                 }

//                 descriptionAtStart.current = description;

//                 try {
//                     // Request permissions first
//                     const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
                    
//                     if (!result.granted) {
//                         RNAlert.alert(
//                             'Permission Required',
//                             'Microphone permission is required for voice input',
//                             [{ text: 'OK' }]
//                         );
//                         return;
//                     }

//                     // Start speech recognition
//                     await ExpoSpeechRecognitionModule.start({
//                         lang: 'en-US',
//                         interimResults: true,
//                         continuous: false,
//                     });
//                 } catch (error) {
//                     console.error('Error starting speech recognition:', error);
//                     setIsListening(false);
                    
//                     if (error instanceof Error) {
//                         RNAlert.alert('Error', error.message || 'Failed to start speech recognition');
//                     }
//                 }
//             }
//         } catch (error) {
//             console.error('Error in handleVoiceInput:', error);
//             setIsListening(false);
//         }
//     };

//     // Remove photo
//     const handleRemovePhoto = (index: number) => {
//         setPhotos(photos.filter((_, i) => i !== index));
//     };

//     const validate = () => {
//         const newErrors: typeof errors = {};
//         if (!category) newErrors.category = 'Please select a category';
//         if (!title.trim()) newErrors.title = 'Title is required';
//         if (!description.trim()) newErrors.description = 'Description is required';
//         if (!addressText.trim()) newErrors.address = 'Location is required';
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async () => {
//         if (!validate()) return;
//         setLoading(true);
//         setError('');
//         try {
//             const attachmentUrls = photos;

//             const ticketData = {
//                 id: `TKT-${Date.now()}`,
//                 created_by: user?.id || '4c8d7866-be1c-4b5d-8cb1-71a9a5a09d7f',
//                 category,
//                 title: title.trim(),
//                 description: description.trim(),
//                 address_text: addressText.trim(),
//                 lat,
//                 lng,
//                 status: 'open',
//                 assigned_to: null,
//                 current_supervisor: null,
//                 citizen_rating: null,
//                 citizen_feedback: null,
//                 created_at: Date.now(),
//                 updated_at: Date.now(),
//                 closed_at: null,
//             };

//             console.log('Creating ticket:', ticketData);

//             zero.mutate(
//                 mutators.createTicket({
//                     created_by: ticketData.created_by,
//                     category: ticketData.category,
//                     title: ticketData.title,
//                     description: ticketData.description,
//                     address_text: ticketData.address_text,
//                     lat: ticketData.lat,
//                     lng: ticketData.lng,
//                     attachmentUrls,
//                 })
//             );

//             setShowSuccess(true);
//             setTimeout(() => {
//                 router.back();
//             }, 1500);
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to create ticket');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleClose = () => {
//         router.back();
//     };

//     return (
//         <SafeAreaView style={styles.container} edges={['top']}>
//             {/* Success Card */}
//             {showSuccess && (
//                 <View style={styles.successCard}>
//                     <Ionicons name="checkmark-circle" size={32} color="#10B981" style={{ marginBottom: 8 }} />
//                     <ThemedText style={styles.successText}>Ticket created successfully!</ThemedText>
//                 </View>
//             )}

//             {/* Map View with Header Overlay */}
//             <View style={styles.mapContainer}>
//                 {/* Map Placeholder */}
//                 <View style={styles.mapPlaceholder}>
//                     <Image
//                         source={require('@/assets/images/react-logo.png')}
//                         style={styles.mapImage}
//                         resizeMode="cover"
//                     />
//                 </View>

//                 {/* Header Overlay */}
//                 <View style={styles.headerOverlay}>
//                     <Pressable onPress={handleClose} style={styles.backButtonOverlay}>
//                         <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
//                     </Pressable>
//                     <ThemedText style={styles.headerOverlayTitle}>Raise Grievance</ThemedText>
//                     <View style={styles.placeholderIcon} />
//                 </View>
//             </View>

//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 style={styles.keyboardView}
//             >
//                 <ScrollView
//                     contentContainerStyle={styles.scrollContent}
//                     keyboardShouldPersistTaps="handled"
//                     showsVerticalScrollIndicator={false}
//                 >
//                     {error && (
//                         <Alert
//                             message={error}
//                             type="error"
//                             onDismiss={() => setError('')}
//                         />
//                     )}

//                     {/* Title */}
//                     <View style={styles.section}>
//                         <AuthInput
//                             label="Issue Title *"
//                             placeholder="Brief title for your issue"
//                             value={title}
//                             onChangeText={setTitle}
//                             error={errors.title}
//                             autoCapitalize="sentences"
//                         />
//                     </View>

//                     {/* Location Section */}
//                     <View style={styles.sectionWithHeader}>
//                         <ThemedText style={styles.sectionHeader}>Location Details</ThemedText>
//                         <View style={styles.sectionContent}>
//                             <LocationInput
//                                 value={addressText}
//                                 onLocationSelect={(address, latitude, longitude) => {
//                                     setAddressText(address);
//                                     setLat(latitude || null);
//                                     setLng(longitude || null);
//                                 }}
//                                 error={errors.address}
//                                 placeholder="Search for address or landmark"
//                             />
//                         </View>
//                     </View>

//                     {/* Description Section */}
//                     <View style={styles.sectionWithHeader}>
//                         <View style={styles.labelWithButton}>
//                             <ThemedText style={styles.sectionHeader}>Issue Description</ThemedText>
//                             <Pressable 
//                                 style={[
//                                     styles.voiceButton,
//                                     isListening && styles.voiceButtonActive
//                                 ]}
//                                 onPress={handleVoiceInput}
//                             >
//                                 <Ionicons 
//                                     name={isListening ? "stop-circle" : "mic-outline"} 
//                                     size={16} 
//                                     color={isListening ? "#fff" : "#2196F3"} 
//                                 />
//                                 <ThemedText style={[
//                                     styles.voiceButtonText,
//                                     isListening && styles.voiceButtonTextActive
//                                 ]}>
//                                     {isListening ? 'Stop' : 'Voice'}
//                                 </ThemedText>
//                             </Pressable>
//                         </View>
//                         <View style={[styles.textAreaContainer, errors.description && styles.inputError]}>
//                             <TextInput
//                                 style={styles.textArea}
//                                 placeholder="Please provide detailed information about the issue..."
//                                 placeholderTextColor="#9CA3AF"
//                                 value={description}
//                                 onChangeText={setDescription}
//                                 multiline
//                                 numberOfLines={5}
//                                 textAlignVertical="top"
//                             />
//                         </View>
//                         {errors.description && (
//                             <ThemedText style={styles.errorText}>{errors.description}</ThemedText>
//                         )}
//                         <ThemedText style={styles.charCount}>
//                             {description.length}/500 characters
//                         </ThemedText>
//                     </View>

//                     {/* Photo Upload */}
//                     <View style={styles.sectionWithHeader}>
//                         <ThemedText style={styles.sectionHeader}>
//                             Add a photo (optional)
//                         </ThemedText>
                        
//                         {/* Photo Preview Grid */}
//                         {photos.length > 0 && (
//                             <View style={styles.photoPreviewContainer}>
//                                 {photos.map((uri, index) => (
//                                     <View key={index} style={styles.photoPreview}>
//                                         <Image source={{ uri }} style={styles.photoImage} />
//                                         <Pressable
//                                             style={styles.removePhotoButton}
//                                             onPress={() => handleRemovePhoto(index)}
//                                         >
//                                             <Ionicons name="close-circle" size={24} color="#EF4444" />
//                                         </Pressable>
//                                     </View>
//                                 ))}
//                             </View>
//                         )}

//                         {/* Upload Buttons */}
//                         {photos.length < 5 && (
//                             <View style={styles.photoUploadContainer}>
//                                 <Pressable 
//                                     style={[
//                                         styles.photoUploadButton,
//                                         classifyingImages && { opacity: 0.6 }
//                                     ]}
//                                     onPress={handleTakePhoto}
//                                     disabled={classifyingImages}
//                                 >
//                                     <Ionicons name="camera-outline" size={48} color="#2196F3" />
//                                     <ThemedText style={styles.photoUploadText}>Take or Upload Photo</ThemedText>
//                                 </Pressable>
//                             </View>
//                         )}
//                     </View>

//                     {/* Submit Button */}
//                     <View style={styles.submitContainer}>
//                         <AuthButton
//                             title="Send My Complaint"
//                             onPress={handleSubmit}
//                             loading={loading}
//                         />
//                         <ThemedText style={styles.disclaimer}>
//                             By submitting, you confirm that the information provided is accurate
//                         </ThemedText>
//                     </View>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F5F5F5',
//     },
//     mapContainer: {
//         width: '100%',
//         height: 280,
//         position: 'relative',
//         overflow: 'hidden',
//     },
//     mapPlaceholder: {
//         width: '100%',
//         height: '100%',
//         backgroundColor: '#CCCCCC',
//     },
//     mapImage: {
//         width: '100%',
//         height: '100%',
//     },
//     headerOverlay: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         paddingTop: 50,
//         paddingBottom: 12,
//     },
//     backButtonOverlay: {
//         width: 40,
//         height: 40,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     headerOverlayTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#FFFFFF',
//     },
//     placeholderIcon: {
//         width: 40,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         backgroundColor: '#333333',
//         borderBottomWidth: 1,
//         borderBottomColor: '#E5E5E5',
//     },
//     closeButton: {
//         width: 40,
//         height: 40,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#FFFFFF',
//     },
//     placeholder: {
//         width: 40,
//     },
//     keyboardView: {
//         flex: 1,
//     },
//     scrollContent: {
//         padding: 16,
//         paddingBottom: 40,
//         backgroundColor: '#F5F5F5',
//     },
//     progressContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 24,
//     },
//     progressStep: {
//         alignItems: 'center',
//     },
//     progressDot: {
//         width: 12,
//         height: 12,
//         borderRadius: 6,
//         backgroundColor: '#E5E7EB',
//         marginBottom: 4,
//     },
//     progressDotActive: {
//         backgroundColor: '#6366F1',
//     },
//     progressLine: {
//         width: 60,
//         height: 2,
//         backgroundColor: '#E5E7EB',
//         marginHorizontal: 8,
//         marginBottom: 16,
//     },
//     progressLabel: {
//         fontSize: 12,
//         color: '#6B7280',
//     },
//     section: {
//         marginBottom: 24,
//     },
//     sectionTitle: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#374151',
//         marginBottom: 12,
//     },
//     label: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#374151',
//         marginBottom: 8,
//     },
//     labelWithButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: 8,
//     },
//     voiceButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 6,
//         backgroundColor: '#FFFFFF',
//         paddingHorizontal: 10,
//         paddingVertical: 6,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: '#E5E5E5',
//     },
//     voiceButtonActive: {
//         backgroundColor: '#2196F3',
//         borderColor: '#2196F3',
//     },
//     voiceButtonText: {
//         fontSize: 12,
//         fontWeight: '500',
//         color: '#2196F3',
//     },
//     voiceButtonTextActive: {
//         color: '#FFFFFF',
//     },
//     categoriesGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         marginHorizontal: -6,
//     },
//     categoryCard: {
//         width: '25%',
//         padding: 6,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: 'transparent',
//         alignItems: 'center',
//     },
//     categoryCardSelected: {
//         transform: [{ scale: 1.05 }],
//     },
//     categoryIcon: {
//         width: '100%',
//         aspectRatio: 1,
//         borderRadius: 12,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 6,
//         borderWidth: 1,
//         borderColor: 'transparent',
//     },
//     categoryLabel: {
//         fontSize: 11,
//         color: '#6B7280',
//         textAlign: 'center',
//         fontWeight: '500',
//     },
//     textAreaContainer: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: '#E5E5E5',
//     },
//     textArea: {
//         height: 120,
//         padding: 14,
//         fontSize: 15,
//         color: '#1F2937',
//     },
//     inputError: {
//         borderColor: '#EF4444',
//     },
//     errorText: {
//         fontSize: 12,
//         color: '#EF4444',
//         marginTop: 4,
//     },
//     charCount: {
//         fontSize: 12,
//         color: '#9CA3AF',
//         textAlign: 'right',
//         marginTop: 4,
//     },
//     photoPreviewContainer: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         gap: 12,
//         marginBottom: 12,
//     },
//     photoPreview: {
//         width: 100,
//         height: 100,
//         borderRadius: 12,
//         overflow: 'hidden',
//         position: 'relative',
//     },
//     photoImage: {
//         width: '100%',
//         height: '100%',
//         resizeMode: 'cover',
//     },
//     removePhotoButton: {
//         position: 'absolute',
//         top: 4,
//         right: 4,
//         backgroundColor: '#fff',
//         borderRadius: 12,
//     },
//     photoUploadContainer: {
//         flexDirection: 'row',
//         gap: 12,
//     },
//     photoUploadButton: {
//         flex: 1,
//         backgroundColor: '#FFFFFF',
//         borderRadius: 12,
//         borderWidth: 2,
//         borderColor: '#E5E5E5',
//         borderStyle: 'dashed',
//         paddingVertical: 40,
//         alignItems: 'center',
//         gap: 12,
//     },
//     photoUploadText: {
//         fontSize: 16,
//         color: '#9CA3AF',
//         fontWeight: '500',
//     },
//     sectionWithHeader: {
//         marginBottom: 24,
//     },
//     sectionHeader: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#000000',
//         marginBottom: 12,
//     },
//     sectionContent: {
//         marginTop: 8,
//     },
//     submitContainer: {
//         marginTop: 8,
//     },
//     disclaimer: {
//         fontSize: 12,
//         color: '#9CA3AF',
//         textAlign: 'center',
//         marginTop: 12,
//         lineHeight: 18,
//     },
//     successCard: {
//         position: 'absolute',
//         top: 40,
//         left: 20,
//         right: 20,
//         zIndex: 100,
//         backgroundColor: '#FFFFFF',
//         borderRadius: 16,
//         padding: 24,
//         alignItems: 'center',
//         shadowColor: '#10B981',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.15,
//         shadowRadius: 12,
//         elevation: 8,
//         borderWidth: 1,
//         borderColor: '#D1FAE5',
//         flexDirection: 'column',
//         gap: 4,
//     },
//     successText: {
//         fontSize: 16,
//         color: '#10B981',
//         fontWeight: '600',
//         textAlign: 'center',
//     },
// });