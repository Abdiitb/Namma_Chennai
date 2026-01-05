import { StyleSheet, View, ScrollView, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'grid-outline' as const },
  { id: 'roads', label: 'Roads', icon: 'car-outline' as const },
  { id: 'water', label: 'Water', icon: 'water-outline' as const },
  { id: 'electricity', label: 'Electricity', icon: 'flash-outline' as const },
  { id: 'sanitation', label: 'Sanitation', icon: 'trash-outline' as const },
];

const SAMPLE_ISSUES = [
  {
    id: '1',
    title: 'Pothole on Main Road',
    location: 'Anna Nagar East, Chennai',
    category: 'roads',
    status: 'open',
    votes: 23,
    comments: 5,
    timeAgo: '2 hours ago',
  },
  {
    id: '2',
    title: 'Water Supply Disruption',
    location: 'T. Nagar, Chennai',
    category: 'water',
    status: 'in_progress',
    votes: 45,
    comments: 12,
    timeAgo: '5 hours ago',
  },
  {
    id: '3',
    title: 'Street Light Not Working',
    location: 'Adyar, Chennai',
    category: 'electricity',
    status: 'open',
    votes: 12,
    comments: 3,
    timeAgo: '1 day ago',
  },
  {
    id: '4',
    title: 'Garbage Not Collected',
    location: 'Velachery, Chennai',
    category: 'sanitation',
    status: 'resolved',
    votes: 34,
    comments: 8,
    timeAgo: '2 days ago',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return '#EF4444';
    case 'in_progress': return '#F59E0B';
    case 'resolved': return '#10B981';
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

export default function IssuesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIssues = SAMPLE_ISSUES.filter(issue => {
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Community Issues</ThemedText>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search issues..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Issues List */}
      <ScrollView 
        style={styles.issuesList}
        contentContainerStyle={styles.issuesContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredIssues.map((issue) => (
          <Pressable key={issue.id} style={styles.issueCard}>
            <View style={styles.issueHeader}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(issue.status) + '20' }]}>
                <ThemedText style={[styles.statusText, { color: getStatusColor(issue.status) }]}>
                  {getStatusLabel(issue.status)}
                </ThemedText>
              </View>
              <ThemedText style={styles.timeAgo}>{issue.timeAgo}</ThemedText>
            </View>
            
            <ThemedText style={styles.issueTitle}>{issue.title}</ThemedText>
            
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <ThemedText style={styles.locationText}>{issue.location}</ThemedText>
            </View>

            <View style={styles.issueFooter}>
              <View style={styles.footerItem}>
                <Ionicons name="arrow-up-outline" size={16} color="#6B7280" />
                <ThemedText style={styles.footerText}>{issue.votes} votes</ThemedText>
              </View>
              <View style={styles.footerItem}>
                <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                <ThemedText style={styles.footerText}>{issue.comments} comments</ThemedText>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  categoryLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: '#fff',
  },
  issuesList: {
    flex: 1,
  },
  issuesContent: {
    padding: 16,
    gap: 12,
  },
  issueCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#6B7280',
  },
  issueFooter: {
    flexDirection: 'row',
    gap: 16,
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
    fontSize: 13,
    color: '#6B7280',
  },
});
