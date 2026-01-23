import { StyleSheet, View, ScrollView, Pressable, Dimensions, Image } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ZERO_QUERIES } from '@/zero/queries';
import { useQuery } from '@rocicorp/zero/react';
import { useAuth } from '@/context/auth-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS = ['Open', 'Assigned', 'Completed' , 'All'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return '#EF4444';
    case 'in_progress': return '#F59E0B';
    case 'resolved': return '#10B981';

    default: return '#10B981';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return '#EF4444';
    case 'medium': return '#F59E0B';
    case 'low': return '#10B981';
    default: return '#6B7280';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'open': return 'Open';
    case 'in_progress': return 'In Progress';
    case 'resolved': return 'Resolved';
    default: return status;
  }
};

const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
  switch (category.toLowerCase()) {
    case 'roads': return 'car-outline';
    case 'water': return 'water-outline';
    case 'electricity': return 'flash-outline';
    case 'sanitation': return 'trash-outline';
    default: return 'document-outline';
  }
};

const formatDateTime = (timestamp: number): string => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function TicketsScreen() {
  const [selectedTab, setSelectedTab] = useState('All');
  const { user } = useAuth();
  const [tickets] = useQuery(ZERO_QUERIES.myTickets({userID: user?.id || ''}));

  console.log('Fetched tickets:', tickets);

  const filteredTickets = tickets.filter(ticket => {
    return true;
  });

  console.log('Filtered tickets for tab', selectedTab, ':', filteredTickets);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Grievances</ThemedText>
      </View>

      {/* Scrollable Tabs */}
      {/* <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContentContainer}
          style={styles.tabsScrollView}
        >
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.tabActive]}
              onPress={() => setSelectedTab(tab)}
            >
              <View style={styles.tabContent}>
                {selectedTab === tab && (
                  <Ionicons 
                    name={
                      tab === 'Open' ? 'radio-button-on' : 
                      tab === 'Assigned' ? 'person' : 
                      'checkmark-circle'
                    } 
                    size={16} 
                    color="#000000" 
                  />
                )}
                <ThemedText style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                  {tab}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View> */}

      {/* Tickets List */}
      <ScrollView 
        style={styles.ticketsList}
        contentContainerStyle={[
          styles.ticketsContent,
          filteredTickets.length === 0 && styles.ticketsContentEmpty
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredTickets.map((ticket) => (
          <Pressable
            key={ticket.id}
            style={styles.ticketCard}
            onPress={() => router.push({
              pathname: '/ticket-details',
              params: ticket
            })}
          >
            <View style={styles.ticketTop}>
              <View style={styles.ticketIconAndTitle}>
                <View style={[styles.categoryIcon, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name={getCategoryIcon(ticket.category)} size={15} color="#2196F3" />
                </View>
                <View style={styles.ticketTitleContainer}>
                  <ThemedText style={styles.ticketTitle} numberOfLines={2}>{ticket.title}</ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.ticketLocation}>
              {/* <ThemedText style={styles.locationText} numberOfLines={2}>
                {ticket.description}
              </ThemedText> */}
            </View>

            <View style={styles.ticketFooter}>
              <View style={styles.statusInfo}>
                <ThemedText style={styles.statusLabel}>Status: </ThemedText>
                <ThemedText style={[styles.statusValue, { color: getStatusColor(ticket.status) }]}>
                  {getStatusLabel(ticket.status)}
                </ThemedText>
              </View>
              <View style={styles.dateInfo}>
                <ThemedText style={styles.dateText}>Last Updated: {formatDateTime(ticket.updated_at || ticket.created_at)}</ThemedText>
              </View>
            </View>
          </Pressable>
        ))}

        {filteredTickets.length === 0 && (
          <View style={styles.emptyState}>
            <Image 
              source={require('@/assets/images/8ac415e50ea01982fbab8a7e1eee38071b4a8eec.png')} 
              style={styles.emptyStateImage}
              resizeMode="contain"
            />
            <ThemedText style={styles.emptyStateTitle}>No Open Grievances</ThemedText>
            <ThemedText style={styles.emptyStateSubtitle}>
              You don't have any active complaints right now. If you see something that needs attention,
            </ThemedText>
            <Pressable 
              style={styles.raiseIssueButton}
              onPress={() => {
                router.push('/create-ticket');
              }}
            >
              <ThemedText style={styles.raiseIssueButtonText}>Raise an Issue</ThemedText>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* FAB - Only show when there are tickets */}
      {filteredTickets.length > 0 && (
        <Pressable 
          style={styles.fab}
          onPress={() => {
            router.push('/create-ticket');
          }}
        >
          <Ionicons name="add" size={28} color="#000000" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    alignItems: 'center',

  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#14171F',
  },
  tabsWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tabsScrollView: {
    flexGrow: 0,
  },
  tabsContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  tabActive: {
    backgroundColor: '#333333',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  ticketsList: {
    flex: 1,
  },
  ticketsContent: {
    padding: 16,
    paddingBottom: 100,
  },
  ticketsContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  ticketTop: {
    marginBottom: 12,
  },
  ticketIconAndTitle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  categoryIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ticketTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  ticketLocation: {
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#0066CC',
    textDecorationLine: 'underline',
    lineHeight: 20,
  },
  ticketFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 12,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0d690ebc',
  },
  dateInfo: {
    marginBottom: 0,
  },
  dateText: {
    fontSize: 12,
    color: '#999999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
    minHeight: 400,
  },
  emptyStateImage: {
    width: '100%',
    maxWidth: 350,
    height: 250,
    marginBottom: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  raiseIssueButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  raiseIssueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: SCREEN_WIDTH < 375 ? 16 : 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});