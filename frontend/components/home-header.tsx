import { StyleSheet, View, SafeAreaView, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';

interface HomeHeaderProps {
    userName?: string;
    onNotificationPress?: () => void;
    onProfilePress?: () => void;
}

export function HomeHeader({
    userName = 'Citizen',
    onNotificationPress,
    onProfilePress,
}: HomeHeaderProps) {
    return (
        <View style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.leftSection}>
                    <ThemedText style={styles.greeting}>Hello,</ThemedText>
                    <ThemedText style={styles.userName}>{userName}</ThemedText>
                </View>

                <View style={styles.rightSection}>
                    <Pressable style={styles.iconButton} onPress={onNotificationPress}>
                        <Ionicons name="notifications-outline" size={24} color="#fff" />
                        <View style={styles.badge} />
                    </Pressable>

                    <Pressable style={styles.logoutButton} onPress={onProfilePress}>
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#6366F1',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#6366F1',
    },
    leftSection: {
        flex: 1,
    },
    greeting: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#EF4444',
    },
});
