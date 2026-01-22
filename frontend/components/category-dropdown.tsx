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

interface Category {
    id: string;
    label: string;
    icon: string;
    color: string;
}

interface CategoryDropdownProps {
    label?: string;
    placeholder?: string;
    value: string;
    onSelect: (categoryId: string) => void;
    categories: Category[];
    error?: string;
}

export function CategoryDropdown({
    label = 'Category',
    placeholder = 'Select a category',
    value,
    onSelect,
    categories,
    error,
}: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedCategory = categories.find(cat => cat.id === value);

    const renderCategoryItem = ({ item }: { item: Category }) => (
        <Pressable
            style={[
                styles.dropdownItem,
                value === item.id && styles.dropdownItemSelected,
            ]}
            onPress={() => {
                onSelect(item.id);
                setIsOpen(false);
            }}
        >
            <View
                style={[
                    styles.itemIcon,
                    { backgroundColor: item.color },
                ]}
            >
                <Ionicons name={item.icon as any} size={20} color="#FFFFFF" />
            </View>
            <ThemedText
                style={[
                    styles.itemLabel,
                    value === item.id && styles.itemLabelSelected,
                ]}
            >
                {item.label}
            </ThemedText>
            {value === item.id && (
                <Ionicons name="checkmark" size={20} color="#2196F3" />
            )}
        </Pressable>
    );

    return (
        <View style={styles.container}>
            {label && (
                <ThemedText style={styles.label}>{label} *</ThemedText>
            )}

            {/* Dropdown Button */}
            <Pressable
                style={[
                    styles.dropdownButton,
                    error && styles.dropdownButtonError,
                ]}
                onPress={() => setIsOpen(true)}
            >
                {selectedCategory ? (
                    <View style={styles.selectedContent}>
                        <View
                            style={[
                                styles.selectedIcon,
                                { backgroundColor: selectedCategory.color },
                            ]}
                        >
                            <Ionicons
                                name={selectedCategory.icon as any}
                                size={20}
                                color="#FFFFFF"
                            />
                        </View>
                        <ThemedText style={styles.selectedText}>
                            {selectedCategory.label}
                        </ThemedText>
                    </View>
                ) : (
                    <ThemedText style={styles.placeholderText}>
                        {placeholder}
                    </ThemedText>
                )}
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
                            Select Category
                        </ThemedText>
                        <FlatList
                            data={categories}
                            renderItem={renderCategoryItem}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
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
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
        paddingVertical: 14,
        gap: 12,
    },
    dropdownButtonError: {
        borderColor: '#EF4444',
    },
    selectedContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    selectedIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedText: {
        fontSize: 15,
        color: '#1F2937',
        fontWeight: '500',
        flex: 1,
    },
    placeholderText: {
        fontSize: 15,
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
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 8,
        borderRadius: 10,
        backgroundColor: '#F9FAFB',
        gap: 12,
    },
    dropdownItemSelected: {
        backgroundColor: '#E3F2FD',
    },
    itemIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemLabel: {
        flex: 1,
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
    },
    itemLabelSelected: {
        color: '#2196F3',
        fontWeight: '600',
    },
});
