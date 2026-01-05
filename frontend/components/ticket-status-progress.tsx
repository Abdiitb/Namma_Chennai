import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

type TicketStatus = 'new' | 'assigned' | 'in_progress' | 'waiting_supervisor' | 'resolved';

interface StatusStep {
  key: TicketStatus;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const STATUS_STEPS: StatusStep[] = [
  { key: 'new', label: 'New', icon: 'add-circle-outline' },
  { key: 'assigned', label: 'Assigned', icon: 'person-outline' },
  { key: 'in_progress', label: 'In Progress', icon: 'construct-outline' },
  { key: 'waiting_supervisor', label: 'Review', icon: 'eye-outline' },
  { key: 'resolved', label: 'Resolved', icon: 'checkmark-circle-outline' },
];

const getStatusIndex = (status: string): number => {
  const index = STATUS_STEPS.findIndex(step => step.key === status);
  return index === -1 ? 0 : index;
};

interface TicketStatusProgressProps {
  status: string;
}

export default function TicketStatusProgress({ status, }: TicketStatusProgressProps) {
  const currentIndex = getStatusIndex(status);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Ticket Progress</ThemedText>
      
      <View style={styles.progressContainer}>
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;
          
          return (
            <View key={step.key} style={styles.stepWrapper}>
              {/* Connector Line (before step, except first) */}
              {index > 0 && (
                <View 
                  style={[
                    styles.connectorLine,
                    styles.connectorLeft,
                    (isCompleted || isCurrent) && styles.connectorCompleted,
                  ]} 
                />
              )}
              
              {/* Step Circle */}
              <View style={styles.stepContent}>
                <View
                  style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCircleCompleted,
                    isCurrent && styles.stepCircleCurrent,
                    isUpcoming && styles.stepCircleUpcoming,
                  ]}
                >
                  <Ionicons
                    name={isCompleted ? 'checkmark' : step.icon}
                    size={16}
                    color={isCompleted || isCurrent ? '#FFFFFF' : '#9CA3AF'}
                  />
                </View>
                
                {/* Step Label */}
                <ThemedText
                  style={[
                    styles.stepLabel,
                    (isCompleted || isCurrent) && styles.stepLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {step.label}
                </ThemedText>
              </View>
              
              {/* Connector Line (after step, except last) */}
              {index < STATUS_STEPS.length - 1 && (
                <View 
                  style={[
                    styles.connectorLine,
                    styles.connectorRight,
                    isCompleted && styles.connectorCompleted,
                  ]} 
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  stepWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepCircleCurrent: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  stepCircleUpcoming: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  stepLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 56,
  },
  stepLabelActive: {
    color: '#374151',
    fontWeight: '600',
  },
  connectorLine: {
    position: 'absolute',
    top: 15,
    height: 2,
    backgroundColor: '#E5E7EB',
  },
  connectorLeft: {
    left: 0,
    right: '50%',
    marginRight: 16,
  },
  connectorRight: {
    left: '50%',
    right: 0,
    marginLeft: 16,
  },
  connectorCompleted: {
    backgroundColor: '#10B981',
  },
});