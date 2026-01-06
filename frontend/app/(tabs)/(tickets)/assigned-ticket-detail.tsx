import { View, StyleSheet, ScrollView, Pressable, Dimensions, Image, Modal } from 'react-native';
import { useState } from 'react';
import { TicketStaffActions } from '@/components/TicketStaffActions';
import { ThemedText } from '@/components/themed-text';
import TicketStatusProgress from '@/components/ticket-status-progress';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@rocicorp/zero/react';
import { ZERO_QUERIES } from '@/zero/queries';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 375;
const isMediumScreen = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;

const getStatusColor = (status: string) => {
    switch (status) {
        case 'open': return '#EF4444';
        case 'assigned': return '#F59E0B';
        case 'in_progress': return '#3B82F6';
        case 'waiting_supervisor': return '#8B5CF6';
        case 'resolved': return '#10B981';
        default: return '#6B7280';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'open': return 'New';
        case 'assigned': return 'Assigned';
        case 'in_progress': return 'In Progress';
        case 'waiting_supervisor': return 'Under Review';
        case 'resolved': return 'Resolved';
        default: return status;
    }
};

const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    switch (category?.toLowerCase()) {
        case 'roads': return 'car-outline';
        case 'water': return 'water-outline';
        case 'electricity': return 'flash-outline';
        case 'sanitation': return 'trash-outline';
        case 'street lights': return 'bulb-outline';
        case 'drainage': return 'rainy-outline';
        default: return 'document-outline';
    }
};

const getCategoryColor = (category: string) => {
    return '#FFD600';
};

export default function TicketDetailsScreen() {
    const params = useLocalSearchParams();
    //   const [ticketStatus, setTicketStatus] = useState(params.status);
    const ticketStatus = useQuery(ZERO_QUERIES.getTicket({ ticketID: params.id as string }))[0][0]?.status;
    const [ticketAttachments] = useQuery(ZERO_QUERIES.getTicketAttachments({ ticketID: params.id as string }));
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Fetch user names for created_by, assigned_to, and current_supervisor
    const [createdByUser] = useQuery(
        ZERO_QUERIES.getUser({ userID: (params.created_by as string) || '' })
    );
    const [assignedToUser] = useQuery(
        ZERO_QUERIES.getUser({ userID: (params.assigned_to as string) || '' })
    );
    const [supervisorUser] = useQuery(
        ZERO_QUERIES.getUser({ userID: (params.current_supervisor as string) || '' })
    );

    const createdByName = createdByUser?.[0]?.name || (params.created_by as string) || 'N/A';
    const assignedToName = assignedToUser?.[0]?.name || (params.assigned_to as string);
    const supervisorName = supervisorUser?.[0]?.name || (params.current_supervisor as string);

    // TODO: Replace with actual user context
    const actorId = params.assigned_to as string || params.created_by as string || '';

    if (!params || !params.id) {
        return (
            <View style={styles.screen}>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <ThemedText style={styles.errorText}>Ticket not found</ThemedText>
                </View>
            </View>
        );
    }

    const createdAt = params.created_at
        ? new Date(Number(params.created_at)).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : 'N/A';

    const updatedAt = params.updated_at
        ? new Date(Number(params.updated_at)).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : 'N/A';

    const closedAt = params.closed_at
        ? new Date(Number(params.closed_at)).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : null;

    const statusColor = getStatusColor(params.status as string);
    const categoryIcon = getCategoryIcon(params.category as string);
    const categoryColor = getCategoryColor(params.category as string);

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="#FFD600" />
                </Pressable>
                <ThemedText style={styles.headerTitle} numberOfLines={1}>Ticket Details</ThemedText>
                <Pressable style={styles.moreButton}>
                    <Ionicons name="ellipsis-vertical" size={20} color="#FFD600" />
                </Pressable>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Info Card */}
                <View style={styles.mainCard}>
                    {/* Category & Status Header */}
                    <View style={styles.cardHeader}>
                        <View style={styles.categoryBadge}>
                            <View style={[styles.categoryIconBox, { backgroundColor: categoryColor + '15' }]}>
                                <Ionicons name={categoryIcon} size={isSmallScreen ? 18 : 22} color={categoryColor} />
                            </View>
                            <View style={styles.categoryTextContainer}>
                                <ThemedText style={styles.ticketIdText} numberOfLines={1}>{params.id}</ThemedText>
                                <ThemedText style={styles.categoryText} numberOfLines={1}>{params.category}</ThemedText>
                            </View>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                            <ThemedText style={[styles.statusText, { color: statusColor }]}>
                                {getStatusLabel(params.status as string)}
                            </ThemedText>
                        </View>
                    </View>

                    {/* Title & Description */}
                    <ThemedText style={styles.title}>{params.title || 'Untitled Ticket'}</ThemedText>
                    <ThemedText style={styles.description}>{params.description}</ThemedText>

                    {/* Location */}
                    {params.address_text && (
                        <View style={styles.locationBox}>
                            <Ionicons name="location" size={16} color="#FFD600" />
                            <ThemedText style={styles.locationText}>{params.address_text}</ThemedText>
                        </View>
                    )}
                </View>

                {/* Attachments */}
                {ticketAttachments && ticketAttachments.length > 0 && (
                    <View style={styles.attachmentsCard}>
                        <ThemedText style={styles.sectionTitle}>Attachments</ThemedText>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.attachmentsContainer}
                        >
                            {ticketAttachments.map((attachment, index) => (
                                <Pressable
                                    key={attachment.id || index}
                                    style={styles.attachmentItem}
                                    onPress={() => setSelectedImage(attachment.url)}
                                >
                                    <Image
                                        source={{ uri: attachment.url }}
                                        style={styles.attachmentImage}
                                        resizeMode="cover"
                                    />
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Image Viewer Modal */}
                <Modal
                    visible={selectedImage !== null}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setSelectedImage(null)}
                >
                    <View style={styles.modalContainer}>
                        <Pressable
                            style={styles.modalCloseButton}
                            onPress={() => setSelectedImage(null)}
                        >
                            <Ionicons name="close" size={28} color="#FFFFFF" />
                        </Pressable>
                        {selectedImage && (
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.modalImage}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </Modal>

                {/* Progress Tracker */}
                {/* <TicketStatusProgress status={params.status as string} /> */}
                <TicketStatusProgress status={ticketStatus as string} />

                {/* Details Grid */}
                <View style={styles.detailsCard}>
                    <ThemedText style={styles.sectionTitle}>Ticket Information</ThemedText>

                    <View style={styles.detailsGrid}>
                        <DetailItem
                            icon="calendar-outline"
                            label="Created"
                            value={createdAt}
                            iconColor="#FFD600"
                        />
                        <DetailItem
                            icon="time-outline"
                            label="Last Updated"
                            value={updatedAt}
                            iconColor="#FFD600"
                        />
                        {closedAt && (
                            <DetailItem
                                icon="checkmark-done-outline"
                                label="Closed"
                                value={closedAt}
                                iconColor="#FFD600"
                            />
                        )}
                        <DetailItem
                            icon="person-outline"
                            label="Created By"
                            value={createdByName}
                            iconColor="#FFD600"
                        />
                        {params.assigned_to && (
                            <DetailItem
                                icon="people-outline"
                                label="Assigned To"
                                value={assignedToName}
                                iconColor="#FFD600"
                            />
                        )}
                        {params.current_supervisor && (
                            <DetailItem
                                icon="shield-checkmark-outline"
                                label="Supervisor"
                                value={supervisorName}
                                iconColor="#FFD600"
                            />
                        )}
                    </View>
                </View>

                {/* Feedback Card (if resolved) */}
                {params.status === 'resolved' && (
                    <View style={styles.feedbackCard}>
                        <ThemedText style={styles.sectionTitle}>Citizen Feedback</ThemedText>

                        <View style={styles.ratingContainer}>
                            <ThemedText style={styles.ratingLabel}>Rating</ThemedText>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Ionicons
                                        key={star}
                                        name={Number(params.citizen_rating) >= star ? 'star' : 'star-outline'}
                                        size={isSmallScreen ? 20 : 24}
                                        color={Number(params.citizen_rating) >= star ? '#F59E0B' : '#D1D5DB'}
                                    />
                                ))}
                            </View>
                        </View>

                        {params.citizen_feedback && (
                            <View style={styles.feedbackTextBox}>
                                <Ionicons name="chatbubble-ellipses-outline" size={16} color="#FFD600" />
                                <ThemedText style={styles.feedbackText}>
                                    "{params.citizen_feedback}"
                                </ThemedText>
                            </View>
                        )}

                        {!params.citizen_rating && !params.citizen_feedback && (
                            <View style={styles.noFeedbackBox}>
                                <Ionicons name="chatbubbles-outline" size={24} color="#D1D5DB" />
                                <ThemedText style={styles.noFeedbackText}>No feedback provided yet</ThemedText>
                            </View>
                        )}
                    </View>
                )}

                {/* Staff Actions Dropdown */}
                <TicketStaffActions ticketId={params.id as string} actorId={actorId} />
                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    {params.status !== 'resolved' && (
                        <Pressable style={styles.primaryButton}>
                            <Ionicons name="chatbubble-outline" size={18} color="#000000" />
                            <ThemedText style={styles.primaryButtonText}>Add Comment</ThemedText>
                        </Pressable>
                    )}
                    {params.status === 'resolved' && !params.citizen_rating && (
                        <Pressable style={styles.primaryButton}>
                            <Ionicons name="star-outline" size={18} color="#000000" />
                            <ThemedText style={styles.primaryButtonText}>Rate Service</ThemedText>
                        </Pressable>
                    )}
                    <Pressable style={styles.secondaryButton}>
                        <Ionicons name="share-outline" size={18} color="#000000" />
                        <ThemedText style={styles.secondaryButtonText}>Share</ThemedText>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

interface DetailItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    iconColor: string;
}

function DetailItem({ icon, label, value, iconColor }: DetailItemProps) {
    return (
        <View style={styles.detailItem}>
            <View style={[styles.detailIconBox, { backgroundColor: iconColor + '15' }]}>
                <Ionicons name={icon} size={isSmallScreen ? 14 : 16} color={iconColor} />
            </View>
            <View style={styles.detailTextContainer}>
                <ThemedText style={styles.detailLabel}>{label}</ThemedText>
                <ThemedText style={styles.detailValue} numberOfLines={2}>{value}</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: isSmallScreen ? 12 : 16,
        paddingVertical: 10,
        backgroundColor: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
        gap: 8,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        flexShrink: 0,
    },
    headerTitle: {
        flex: 1,
        fontSize: isSmallScreen ? 16 : 18,
        fontWeight: '600',
        color: '#FFD600',
        textAlign: 'center',
    },
    moreButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: isSmallScreen ? 12 : 16,
        paddingBottom: 32,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 12,
    },
    mainCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: isSmallScreen ? 12 : 16,
        padding: isSmallScreen ? 14 : 20,
        borderWidth: 1,
        borderColor: '#000000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: isSmallScreen ? 12 : 16,
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: isSmallScreen ? 8 : 12,
        flex: 1,
        minWidth: 0,
    },
    categoryIconBox: {
        width: isSmallScreen ? 36 : 44,
        height: isSmallScreen ? 36 : 44,
        borderRadius: isSmallScreen ? 10 : 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    categoryTextContainer: {
        flex: 1,
        minWidth: 0,
    },
    ticketIdText: {
        fontSize: isSmallScreen ? 12 : 13,
        fontWeight: '600',
        color: '#000000',
    },
    categoryText: {
        fontSize: isSmallScreen ? 11 : 12,
        color: '#6B7280',
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: isSmallScreen ? 8 : 12,
        paddingVertical: isSmallScreen ? 4 : 6,
        borderRadius: 20,
        gap: isSmallScreen ? 4 : 6,
        flexShrink: 0,
    },
    statusDot: {
        width: isSmallScreen ? 6 : 8,
        height: isSmallScreen ? 6 : 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: isSmallScreen ? 10 : 12,
        fontWeight: '600',
    },
    title: {
        fontSize: isSmallScreen ? 17 : 20,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 8,
        lineHeight: isSmallScreen ? 24 : 28,
    },
    description: {
        fontSize: isSmallScreen ? 14 : 15,
        color: '#6B7280',
        lineHeight: isSmallScreen ? 20 : 22,
        marginBottom: 16,
    },
    locationBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#1A1A1A',
        padding: isSmallScreen ? 10 : 12,
        borderRadius: 10,
        gap: 8,
    },
    locationText: {
        flex: 1,
        fontSize: isSmallScreen ? 12 : 13,
        color: '#FFD600',
        lineHeight: 18,
    },
    attachmentsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: isSmallScreen ? 12 : 16,
        padding: isSmallScreen ? 14 : 20,
        borderWidth: 1,
        borderColor: '#000000',
        marginTop: 12,
    },
    attachmentsContainer: {
        gap: 12,
    },
    attachmentItem: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    attachmentImage: {
        width: isSmallScreen ? 180 : 220,
        height: isSmallScreen ? 140 : 170,
        backgroundColor: '#F3F4F6',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    modalImage: {
        width: SCREEN_WIDTH - 32,
        height: '80%',
    },
    detailsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: isSmallScreen ? 12 : 16,
        padding: isSmallScreen ? 14 : 20,
        borderWidth: 1,
        borderColor: '#000000',
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: isSmallScreen ? 13 : 14,
        fontWeight: '600',
        color: '#000000',
        marginBottom: isSmallScreen ? 12 : 16,
    },
    detailsGrid: {
        gap: isSmallScreen ? 10 : 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: isSmallScreen ? 10 : 12,
    },
    detailIconBox: {
        width: isSmallScreen ? 32 : 36,
        height: isSmallScreen ? 32 : 36,
        borderRadius: isSmallScreen ? 8 : 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    detailTextContainer: {
        flex: 1,
        minWidth: 0,
    },
    detailLabel: {
        fontSize: isSmallScreen ? 10 : 11,
        color: '#6B7280',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailValue: {
        fontSize: isSmallScreen ? 13 : 14,
        color: '#000000',
        fontWeight: '500',
        marginTop: 2,
    },
    feedbackCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: isSmallScreen ? 12 : 16,
        padding: isSmallScreen ? 14 : 20,
        borderWidth: 1,
        borderColor: '#000000',
        marginTop: 12,
    },
    ratingContainer: {
        marginBottom: isSmallScreen ? 12 : 16,
    },
    ratingLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
        fontWeight: '500',
    },
    starsRow: {
        flexDirection: 'row',
        gap: isSmallScreen ? 2 : 4,
    },
    feedbackTextBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#1A1A1A',
        padding: isSmallScreen ? 12 : 14,
        borderRadius: 10,
        gap: 8,
    },
    feedbackText: {
        flex: 1,
        fontSize: isSmallScreen ? 13 : 14,
        color: '#FFFFFF',
        fontStyle: 'italic',
        lineHeight: 20,
    },
    noFeedbackBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    noFeedbackText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
    },
    actionsContainer: {
        flexDirection: isSmallScreen ? 'column' : 'row',
        gap: 12,
        marginTop: 20,
    },
    primaryButton: {
        flex: isSmallScreen ? undefined : 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFD600',
        paddingVertical: isSmallScreen ? 12 : 14,
        paddingHorizontal: isSmallScreen ? 16 : 20,
        borderRadius: 12,
        gap: 8,
        shadowColor: '#FFD600',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        fontSize: isSmallScreen ? 14 : 15,
        fontWeight: '600',
        color: '#000000',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
        paddingVertical: isSmallScreen ? 12 : 14,
        paddingHorizontal: isSmallScreen ? 16 : 20,
        borderRadius: 12,
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: isSmallScreen ? 14 : 15,
        fontWeight: '600',
        color: '#000000',
    },
});