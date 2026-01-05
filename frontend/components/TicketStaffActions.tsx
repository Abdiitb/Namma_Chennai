import React, { useState } from 'react';
import { View, Pressable, Modal, StyleSheet, Text, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { simpleQueries, ZERO_QUERIES } from '@/zero/queries';
import { mutators } from '@/zero/mutators';
import { useQuery } from '@rocicorp/zero/react';
import { useZero } from '@rocicorp/zero/react';
import { useAuth } from '@/context/auth-context';
// TODO: Replace with actual data fetching hooks for users and mutation hooks for mutators

interface TicketActionProps {
  ticketId: string;
  actorId: string;
  onActionComplete?: () => void;
}

export const TicketStaffActions: React.FC<TicketActionProps> = ({ ticketId, actorId, onActionComplete }) => {
  const zero = useZero();
  const {user} = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Dummy data for users (replace with real query logic)
  const [usersLoading, setUsersLoading] = useState(false);
  const [users] = useQuery(ZERO_QUERIES.allUsers());
  console.log('Fetched users:', users);
  const staffUsers = users.filter((u) => u.role === 'staff');
  const supervisorUsers = users.filter((u) => u.role === 'supervisor');

  const handleAssignStaff = async () => {
    if (!selectedStaff) return;
    setStatusLoading(true);
    setError(null);
    try {
      zero.mutate(mutators.assignTicket({ticketId: ticketId, staffId: user?.id || '', actorId: selectedStaff}));
      setModalVisible(false);
      onActionComplete?.();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    setStatusLoading(true);
    setError(null);
    try {
        zero.mutate(mutators.startWork({ ticketId, actorId: user?.id || '' }));
      setModalVisible(false);
      onActionComplete?.();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAddStaffUpdate = async () => {
    setStatusLoading(true);
    setError(null);
    try {
        zero.mutate(mutators.addStaffUpdate({ ticketId, actorId: user?.id || '', message: updateText }));
      setModalVisible(false);
      onActionComplete?.();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAssignSupervisor = async () => {
    if (!selectedSupervisor) return;
    setStatusLoading(true);
    setError(null);
    try {
        zero.mutate(mutators.escalateToSupervisor({ ticketId, supervisorId: selectedSupervisor, actorId: user?.id || '' }));
      setModalVisible(false);
      onActionComplete?.();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <View>
      <Pressable style={styles.actionButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="settings-outline" size={18} color="#6366F1" />
        <Text style={styles.actionButtonText}>Staff Actions</Text>
      </Pressable>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!action ? (
              <>
                <Text style={styles.modalTitle}>Select Action</Text>
                <TouchableOpacity style={styles.modalOption} onPress={() => setAction('assignStaff')}>
                  <Text>Assign to Staff</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalOption} onPress={() => setAction('updateStatus')}>
                  <Text>Update Status</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalOption} onPress={() => setAction('addStaffUpdate')}>
                  <Text>Add Staff Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalOption} onPress={() => setAction('assignSupervisor')}>
                  <Text>Assign to Supervisor</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: '#EF4444' }}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : null}

            {action === 'assignStaff' && (
              <>
                <Text style={styles.modalTitle}>Assign to Staff</Text>
                {usersLoading ? <ActivityIndicator /> : staffUsers?.map((u: any) => (
                  <TouchableOpacity key={u.id} style={styles.modalOption} onPress={() => setSelectedStaff(u.id)}>
                    <Text style={{ color: selectedStaff === u.id ? '#6366F1' : '#111827' }}>{u.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.primaryButton} onPress={handleAssignStaff} disabled={!selectedStaff || statusLoading}>
                  <Text style={styles.primaryButtonText}>{statusLoading ? 'Assigning...' : 'Assign'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setAction(null)}>
                  <Text style={{ color: '#EF4444' }}>Back</Text>
                </TouchableOpacity>
              </>
            )}

            {action === 'updateStatus' && (
              <>
                <Text style={styles.modalTitle}>Update Status</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={handleUpdateStatus} disabled={statusLoading}>
                  <Text style={styles.primaryButtonText}>{statusLoading ? 'Updating...' : 'Update'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setAction(null)}>
                  <Text style={{ color: '#EF4444' }}>Back</Text>
                </TouchableOpacity>
              </>
            )}

            {action === 'addStaffUpdate' && (
              <>
                <Text style={styles.modalTitle}>Add Staff Update</Text>
                <View style={styles.inputBox}>
                  <Text>Update:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={updateText}
                    onChangeText={setUpdateText}
                    placeholder="Enter update..."
                    multiline
                  />
                </View>
                <TouchableOpacity style={styles.primaryButton} onPress={handleAddStaffUpdate} disabled={!updateText || statusLoading}>
                  <Text style={styles.primaryButtonText}>{statusLoading ? 'Adding...' : 'Add Update'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setAction(null)}>
                  <Text style={{ color: '#EF4444' }}>Back</Text>
                </TouchableOpacity>
              </>
            )}

            {action === 'assignSupervisor' && (
              <>
                <Text style={styles.modalTitle}>Assign to Supervisor</Text>
                {usersLoading ? <ActivityIndicator /> : supervisorUsers?.map((u: any) => (
                  <TouchableOpacity key={u.id} style={styles.modalOption} onPress={() => setSelectedSupervisor(u.id)}>
                    <Text style={{ color: selectedSupervisor === u.id ? '#6366F1' : '#111827' }}>{u.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.primaryButton} onPress={handleAssignSupervisor} disabled={!selectedSupervisor || statusLoading}>
                  <Text style={styles.primaryButtonText}>{statusLoading ? 'Assigning...' : 'Assign'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setAction(null)}>
                  <Text style={{ color: '#EF4444' }}>Back</Text>
                </TouchableOpacity>
              </>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#6366F1',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 320,
    maxWidth: '90%',
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F2937',
    alignSelf: 'center',
  },
  modalOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 8,
    textAlign: 'center',
  },
  inputBox: {
    marginVertical: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    minHeight: 60,
    marginTop: 6,
    backgroundColor: '#F3F4F6',
  },
});
