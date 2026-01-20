import { StyleSheet, View, SafeAreaView, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/theme';

interface HomeHeaderProps {
    userName?: string;
    location?: string;
    onNotificationPress?: () => void;
    onProfilePress?: () => void;
}

export function HomeHeader({
    userName = 'Citizen',
    location = 'Marina Beach, Chennai',
    onNotificationPress,
    onProfilePress,
}: HomeHeaderProps) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Location Section */}
                <View style={styles.leftSection}>
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={16} color="#F73812" />
                        <ThemedText style={styles.locationText}>{location}</ThemedText>
                    </View>
                </View>

                {/* Right Section - Notification */}
                <View style={styles.rightSection}>
                    <Pressable style={styles.iconButton} onPress={onNotificationPress}>
                        <Ionicons name="notifications-outline" size={22} color={ThemeColors.textBold} />
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: ThemeColors.white,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: ThemeColors.white,
    },
    leftSection: {
        flex: 1,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    locationText: {
        fontSize: 14,
        fontWeight: '600',
        color: ThemeColors.textBold,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
