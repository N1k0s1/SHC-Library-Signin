import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { apiService } from '../services/ApiService';

interface SignInProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (studentId: string) => void;
}

export default function SignIn({ visible, onClose, onSubmit }: SignInProps) {
  const [studentId, setStudentId] = useState('');
  const [classCode, setClassCode] = useState('');
  const [step, setStep] = useState<'ID_INPUT' | 'CLASS_CODE_INPUT' | 'REASON_SELECT'>('ID_INPUT');
  const [loading, setLoading] = useState(false);

  const REASONS = [
    { id: 'books', label: 'Books' },
    { id: 'printing', label: 'Printing' },
    { id: 'catchup_exam', label: 'Catchup Exam' },
    { id: 'study', label: 'Study' },
    { id: 'health', label: 'Health' },
    { id: 'other', label: 'Other' },
  ];

  const handleDone = async () => {
    if (studentId.trim()) {
      setLoading(true);
      try {
        // Check if student is already signed in
        const status = await apiService.getStudentStatus(studentId.trim());
        
        if (status.data?.isInLibrary) {
          // Already in library -> Sign Out (no reason needed)
          await performToggle();
        } else {
          // Not in library -> Sign In (ask for class code)
          setStep('CLASS_CODE_INPUT');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking status:', error);
        // Fallback to toggle if status check fails
        await performToggle();
      }
    }
  };

  const handleClassCodeDone = () => {
    if (classCode.trim()) {
      setStep('REASON_SELECT');
    }
  };

  const performToggle = async (reason?: string) => {
    try {
      const result = await apiService.toggleStudentSignInOut(studentId.trim(), reason, classCode.trim());
      
      if (result.success) {
        onSubmit(studentId.trim());
        resetState();
        // Show single success popup and close when acknowledged
        Alert.alert('Status Updated Successfully', undefined, [{ text: 'OK', onPress: onClose }], {
          cancelable: false,
        });
      } else {
        // Show error message
        Alert.alert(
          'Sign-in Error', 
          result.message || 'Failed to sign in/out',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error signing in/out:', error);
      Alert.alert(
        'Connection Error',
        error instanceof Error ? error.message : 'Network error. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReasonSelect = (reason: string) => {
    performToggle(reason);
  };

  const resetState = () => {
    setStudentId('');
    setClassCode('');
    setStep('ID_INPUT');
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Library Sign-In/Out</Text>
            
            {step === 'ID_INPUT' ? (
              <>
                <Text style={styles.subtitle}>
                  Enter your 5-digit Student ID to sign in or out of the library.
                </Text>
                
                <TextInput
                  style={styles.input}
                  value={studentId}
                  onChangeText={setStudentId}
                  placeholder="Student ID"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  editable={!loading}
                />
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    disabled={loading}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.doneButton, (!studentId.trim() || loading) && styles.doneButtonDisabled]}
                    onPress={handleDone}
                    disabled={!studentId.trim() || loading}
                  >
                    <Text style={styles.doneButtonText}>{loading ? 'Checking...' : 'Next'}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : step === 'CLASS_CODE_INPUT' ? (
              <>
                <Text style={styles.subtitle}>
                  Please enter your current Class Code (eg. 12ENG).
                </Text>
                
                <TextInput
                  style={styles.input}
                  value={classCode}
                  onChangeText={setClassCode}
                  placeholder="Class Code"
                  placeholderTextColor="#999"
                  autoCapitalize="characters"
                />
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setStep('ID_INPUT')}
                  >
                    <Text style={styles.closeButtonText}>Back</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.doneButton, !classCode.trim() && styles.doneButtonDisabled]}
                    onPress={handleClassCodeDone}
                    disabled={!classCode.trim()}
                  >
                    <Text style={styles.doneButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.subtitle}>
                  Please select a reason for your visit:
                </Text>
                
                <View style={styles.reasonsContainer}>
                  {REASONS.map((reason) => (
                    <TouchableOpacity
                      key={reason.id}
                      style={styles.reasonButton}
                      onPress={() => handleReasonSelect(reason.id)}
                      disabled={loading}
                    >
                      <Text style={styles.reasonButtonText}>{reason.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.closeButton, { marginTop: 16, width: '100%' }]}
                  onPress={() => setStep('CLASS_CODE_INPUT')}
                  disabled={loading}
                >
                  <Text style={styles.closeButtonText}>Back</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    // Dim the underlying screen so its content (e.g., the main sign-in/out card) isn't distracting
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent'
  },
  modalContent: {
    backgroundColor: 'rgba(74, 144, 164, 0.95)',
    borderRadius: 16,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    opacity: 0.9,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  doneButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    flex: 1,
    marginLeft: 12,
  },
  doneButtonDisabled: {
    opacity: 0.5,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    flex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  reasonButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: '48%', // Two columns
    marginBottom: 12,
    alignItems: 'center',
  },
  reasonButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});