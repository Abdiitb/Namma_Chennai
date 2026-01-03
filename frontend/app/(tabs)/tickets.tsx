import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ZERO_QUERIES } from '@/zero/queries';
import {useQuery} from '@rocicorp/zero/react'

const TABS = ['All', 'Assigned', 'In Progress', 'Waiting Supervisor', 'Resolved'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return '#EF4444';
    case 'in_progress': return '#F59E0B';
    case 'resolved': return '#10B981';
    default: return '#6B7280';
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

export default function TicketsScreen() {
  const [selectedTab, setSelectedTab] = useState('All');
  const [tickets] = useQuery(ZERO_QUERIES.allTickets());

  console.log('Fetched tickets:', tickets);

  const filteredTickets = tickets.filter(ticket => {
    if (selectedTab === 'All') return true;
    return getStatusLabel(ticket.status) === selectedTab.toLowerCase();
  });

  console.log('Filtered tickets for tab', selectedTab, ':', filteredTickets);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>My Tickets</ThemedText>
        <Pressable style={styles.filterButton}>
          <Ionicons name="filter-outline" size={20} color="#6366F1" />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <ThemedText style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
              {tab}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {/* Tickets List */}
      <ScrollView 
        style={styles.ticketsList}
        contentContainerStyle={styles.ticketsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTickets.map((ticket) => (
          <Pressable
            key={ticket.id}
            style={styles.ticketCard}
            onPress={() => router.push({
              pathname: '/(tabs)/ticket-details',
              params: ticket
            })}
          >
            <View style={styles.ticketHeader}>
              <View style={styles.ticketIdContainer}>
                <View style={[styles.categoryIcon, { backgroundColor: '#EEF2FF' }]}>
                  <Ionicons name={getCategoryIcon(ticket.category)} size={18} color="#6366F1" />
                </View>
                <View>
                  <ThemedText style={styles.ticketId}>{ticket.id}</ThemedText>
                  <ThemedText style={styles.ticketCategory}>{ticket.category}</ThemedText>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) + '20' }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(ticket.status) }]} />
                <ThemedText style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                  {getStatusLabel(ticket.status)}
                </ThemedText>
              </View>
            </View>

            <ThemedText style={styles.ticketTitle}>{ticket.title}</ThemedText>
            <ThemedText style={styles.ticketDescription} numberOfLines={2}>
              {ticket.description}
            </ThemedText>

            <View style={styles.ticketFooter}>
              <View style={styles.footerItem}>
                <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                <ThemedText style={styles.footerText}>{ticket.created_at}</ThemedText>
              </View>
              {/* <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) + '20' }]}>
                <ThemedText style={[styles.priorityText, { color: getPriorityColor(ticket.priority) }]}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                </ThemedText>
              </View> */}
            </View>
          </Pressable>
        ))}

        {filteredTickets.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
            <ThemedText style={styles.emptyText}>No tickets found</ThemedText>
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable 
        style={styles.fab}
        onPress={() => {
          router.push('/create-ticket');
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    marginRight: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#6366F1',
  },
  ticketsList: {
    flex: 1,
  },
  ticketsContent: {
    padding: 16,
    gap: 12,
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ticketIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketId: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '600',
  },
  ticketCategory: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  ticketDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
