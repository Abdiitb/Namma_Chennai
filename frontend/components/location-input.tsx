import { useState, useCallback, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Pressable,
    FlatList,
    ActivityIndicator,
    Keyboard,
    Alert,
} from 'react-native';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

interface LocationResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

interface LocationInputProps {
    value: string;
    onLocationSelect: (address: string, lat: number, lng: number) => void;
    error?: string;
    placeholder?: string;
}

export function LocationInput({
    value,
    onLocationSelect,
    error,
    placeholder = 'Enter address or landmark',
}: LocationInputProps) {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    // Debounced search using Nominatim API (OpenStreetMap)
    const searchLocations = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            // Using Nominatim API - free, no API key required
            // Bias results towards Chennai, India
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                `q=${encodeURIComponent(searchQuery)}&` +
                `format=json&` +
                `addressdetails=1&` +
                `limit=5&` +
                `countrycodes=in&` +
                `viewbox=79.9,13.3,80.4,12.8&` + // Chennai bounding box
                `bounded=0`, // Don't strictly bound, just prefer
                {
                    headers: {
                        'User-Agent': 'NammaChennaiApp/1.0',
                    },
                }
            );

            if (response.ok) {
                const data: LocationResult[] = await response.json();
                setSuggestions(data);
                setShowSuggestions(true);
            }
        } catch (err) {
            console.error('Error searching locations:', err);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleTextChange = (text: string) => {
        setQuery(text);

        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Debounce the search (300ms delay)
        debounceTimer.current = setTimeout(() => {
            searchLocations(text);
        }, 300);
    };

    const handleSelectLocation = (location: LocationResult) => {
        const lat = parseFloat(location.lat);
        const lng = parseFloat(location.lon);

        // Format the display name to be shorter
        const shortName = formatDisplayName(location.display_name);

        setQuery(shortName);
        setSuggestions([]);
        setShowSuggestions(false);
        Keyboard.dismiss();

        onLocationSelect(shortName, lat, lng);
    };

    const formatDisplayName = (displayName: string): string => {
        // Nominatim returns long addresses, let's make them shorter
        const parts = displayName.split(', ');
        // Take first 3-4 meaningful parts
        const meaningfulParts = parts.slice(0, 4).filter(part =>
            !part.match(/^\d{6}$/) // Remove PIN codes
        );
        return meaningfulParts.join(', ');
    };

    const handleGetCurrentLocation = async () => {
        setIsGettingCurrentLocation(true);
        try {
            // Request permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Location permission denied');
                Alert.alert(
                    'Permission Denied',
                    'Please enable location permission in settings to use current location'
                );
                setIsGettingCurrentLocation(false);
                return;
            }

            // Get current position
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const { latitude, longitude } = location.coords;
            console.log('Current location obtained:', { latitude, longitude });

            // Try to reverse geocode to get address
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?` +
                    `lat=${latitude}&` +
                    `lon=${longitude}&` +
                    `format=json`,
                    {
                        headers: {
                            'User-Agent': 'NammaChennaiApp/1.0',
                        },
                    }
                );
                

                if (response.ok) {
                    const data = await response.json();
                    const address = formatDisplayName(data.display_name);
                    console.log('Reverse geocoded address:', address);
                    setQuery(address);
                    setShowSuggestions(false);
                    Keyboard.dismiss();
                    // Call the callback with address and coordinates
                    onLocationSelect(address, latitude, longitude);
                } else {
                    console.error('Reverse geocoding failed:', response.status);
                    // If geocoding fails, use coordinates as fallback
                    const fallbackAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    setQuery(fallbackAddress);
                    setShowSuggestions(false);
                    Keyboard.dismiss();
                    onLocationSelect(fallbackAddress, latitude, longitude);
                }
            } catch (geocodeErr) {
                console.error('Error during geocoding:', geocodeErr);
                // If geocoding fails, use coordinates as fallback
                const fallbackAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                setQuery(fallbackAddress);
                setShowSuggestions(false);
                Keyboard.dismiss();
                onLocationSelect(fallbackAddress, latitude, longitude);
                Alert.alert(
                    'Location Found',
                    `Location set to coordinates: ${fallbackAddress}`
                );
            }
        } catch (err) {
            console.error('Error getting current location:', err);
            Alert.alert(
                'Error',
                err instanceof Error ? err.message : 'Failed to get current location'
            );
        } finally {
            setIsGettingCurrentLocation(false);
        }
    };

    const renderSuggestionItem = ({ item }: { item: LocationResult }) => (
        <Pressable
            style={styles.suggestionItem}
            onPress={() => handleSelectLocation(item)}
        >
            <Ionicons name="location-outline" size={18} color="#6B7280" style={styles.suggestionIcon} />
            <ThemedText style={styles.suggestionText} numberOfLines={2}>
                {formatDisplayName(item.display_name)}
            </ThemedText>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <ThemedText style={styles.label}>Location *</ThemedText>

            {/* Input Container */}
            <View style={[styles.inputContainer, error && styles.inputError]}>
                <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    value={query}
                    onChangeText={handleTextChange}
                    onFocus={() => {
                        if (suggestions.length > 0) {
                            setShowSuggestions(true);
                        }
                    }}
                />
                {isLoading && (
                    <ActivityIndicator size="small" color="#6366F1" style={styles.loader} />
                )}
                {query.length > 0 && !isLoading && (
                    <Pressable
                        onPress={() => {
                            setQuery('');
                            setSuggestions([]);
                            onLocationSelect('', 0, 0);
                        }}
                        style={styles.clearButton}
                    >
                        <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </Pressable>
                )}
            </View>

            {/* Suggestions List */}
            {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item) => item.place_id.toString()}
                        renderItem={renderSuggestionItem}
                        keyboardShouldPersistTaps="handled"
                        scrollEnabled={false}
                    />
                </View>
            )}

            {/* Error Message */}
            {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

            {/* Current Location Button */}
            <Pressable
                style={styles.currentLocationButton}
                onPress={handleGetCurrentLocation}
                disabled={isGettingCurrentLocation}
            >
                {isGettingCurrentLocation ? (
                    <ActivityIndicator size="small" color="#016ACD" />
                ) : (
                    <Ionicons name="navigate-outline" size={18} color="#016ACD" />
                )}
                <ThemedText style={styles.currentLocationText}>
                    {isGettingCurrentLocation ? 'Getting location...' : 'Use Current Location'}
                </ThemedText>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 0,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
    },
    inputError: {
        borderColor: '#EF4444',
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1F2937',
    },
    loader: {
        marginLeft: 8,
    },
    clearButton: {
        padding: 4,
        marginLeft: 4,
    },
    suggestionsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginTop: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        maxHeight: 250,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    suggestionIcon: {
        marginRight: 10,
    },
    suggestionText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
    },
    currentLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
        paddingVertical: 4,
    },
    currentLocationText: {
        fontSize: 14,
        color: '#016ACD',
        fontWeight: '500',
    },
});
