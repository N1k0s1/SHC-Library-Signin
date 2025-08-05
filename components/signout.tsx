import React, { useState } from 'react';
import { ImageBackground, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SignOutProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (studentId: string) => void;
}

export default function SignOut({ visible, onClose, onSubmit }: SignOutProps) {
  const [studentId, setStudentId] = useState('');

  const handleDone = () => {
    if (studentId.trim()) {
      onSubmit(studentId.trim());
      setStudentId('');
    }
  };

  const handleClose = () => {
    setStudentId('');
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
        <ImageBackground
          source={{uri: 'https://jasmax.com/media_opt/Projects/Sacred-Heart-College/_1200x630_crop_center-center_none_ns/210101_00_JASMAX_SacredHeartCollege_N20.jpg'}}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.backgroundOverlay} />
          <View style={styles.container}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Student ID</Text>
              <Text style={styles.subtitle}>
                Enter in your Student ID manually, or scan your Student ID using the provided scanner.
              </Text>
              
              <TextInput
                style={styles.input}
                value={studentId}
                onChangeText={setStudentId}
                placeholder="Student ID"
                placeholderTextColor="#999"
                keyboardType="default"
                autoCapitalize="characters"
                autoFocus={true}
              />
              
              <TouchableOpacity
                style={[styles.doneButton, !studentId.trim() && styles.doneButtonDisabled]}
                onPress={handleDone}
                disabled={!studentId.trim()}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    alignSelf: 'flex-end',
  },
  doneButtonDisabled: {
    opacity: 0.5,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});