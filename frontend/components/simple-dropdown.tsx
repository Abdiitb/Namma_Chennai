import { useState } from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    FlatList,
    Modal,
} from 'react-native';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';

interface SimpleDropdownProps<T> {
    label?: string;
    placeholder?: string;
    value: T | null;
    onSelect: (value: T) => void;
    options: Array<{ value: T; label: string }>;
    error?: string;
    getLabel?: (value: T) => string;
}

export function SimpleDropdown<T extends string | number>({
    label,
    placeholder = 'Select an option',
    value,
    onSelect,
    options,
    error,
    getLabel,
}: SimpleDropdownProps<T>) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(opt => opt.value === value);
    const displayLabel = selectedOption 
        ? selectedOption.label 
        : (value && getLabel ? getLabel(value) : null);

    const renderItem = ({ item }: { item: { value: T; label: string } }) => (
        <Pressable
            style={[
                styles.dropdownItem,
                value === item.value && styles.dropdownItemSelected,
            ]}
            onPress={() => {
                onSelect(item.value);
                setIsOpen(false);
            }}
        >
            <ThemedText
                style={[
                    styles.itemLabel,
                    value === item.value && styles.itemLabelSelected,
                ]}
            >
                {item.label}
            </ThemedText>
            {value === item.value && (
                <Ionicons name="checkmark" size={20} color="#016ACD" />
            )}
        </Pressable>
    );

    return (
        <View style={styles.container}>
            {label && (
                <ThemedText style={styles.label}>{label}</ThemedText>
            )}

            {/* Dropdown Button */}
            <Pressable
                style={[
                    styles.dropdownButton,
                    error && styles.dropdownButtonError,
                ]}
                onPress={() => setIsOpen(true)}
            >
                <ThemedText style={displayLabel ? styles.selectedText : styles.placeholderText}>
                    {displayLabel || placeholder}
                </ThemedText>
                <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#9CA3AF"
                />
            </Pressable>

            {error && (
                <ThemedText style={styles.errorText}>{error}</ThemedText>
            )}

            {/* Dropdown Modal */}
            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={styles.modalContent}>
                        <ThemedText style={styles.modalTitle}>
                            {label || 'Select Option'}
                        </ThemedText>
                        <FlatList
                            data={options}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `${item.value}-${index}`}
                            scrollEnabled={options.length > 5}
                            style={styles.list}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 0,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    dropdownButtonError: {
        borderColor: '#EF4444',
    },
    selectedText: {
        fontSize: 16,
        color: '#1F2937',
        flex: 1,
    },
    placeholderText: {
        fontSize: 16,
        color: '#9CA3AF',
        flex: 1,
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 20,
        width: '85%',
        maxWidth: 400,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    list: {
        maxHeight: 400,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 8,
        borderRadius: 10,
        backgroundColor: '#F9FAFB',
    },
    dropdownItemSelected: {
        backgroundColor: '#E3F2FD',
    },
    itemLabel: {
        flex: 1,
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
    },
    itemLabelSelected: {
        color: '#016ACD',
        fontWeight: '600',
    },
});
