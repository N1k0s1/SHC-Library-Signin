import React, { useState } from 'react';
import { ImageBackground, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

/**
 * Props interface for the SignOut component
 */
interface SignOutProps {
  visible: boolean; // Controls whether the modal is displayed
  onClose: () => void; // Callback function when modal is closed
  onSubmit: (studentId: string) => void; // Callback function when student ID is submitted
}

/**
 * SignOut Component
 * A modal component that allows students to sign out of the library by entering their student ID
 * 
 * @param visible - Boolean to control modal visibility
 * @param onClose - Function called when modal is closed
 * @param onSubmit - Function called when student ID is submitted
 */
export default function SignOut({ visible, onClose, onSubmit }: SignOutProps) {
  // State to store the student ID input
  const [studentId, setStudentId] = useState('');

  /**
   * Handles the submission of the student ID
   * Only proceeds if the student ID is not empty after trimming whitespace
   */
  const handleDone = () => {
    if (studentId.trim()) {
      onSubmit(studentId.trim()); // Call parent's submit handler with trimmed ID
      setStudentId(''); // Reset the input field
    }
  };

  /**
   * Handles closing the modal
   * Resets the input field and calls the parent's close handler
   */
  const handleClose = () => {
    setStudentId(''); // Clear input when closing
    onClose(); // Call parent's close handler
  };

  return (
    // Main modal container with fade animation
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Semi-transparent overlay background */}
      <View style={styles.modalOverlay}>
        {/* Background image with Sacred Heart College photo */}
        <ImageBackground
          source={{uri: 'https://jasmax.com/media_opt/Projects/Sacred-Heart-College/_1200x630_crop_center-center_none_ns/210101_00_JASMAX_SacredHeartCollege_N20.jpg'}}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Additional overlay to lighten the background image */}
          <View style={styles.backgroundOverlay} />
          
          {/* Main container for centering the modal content */}
          <View style={styles.container}>
            {/* Modal content card */}
            <View style={styles.modalContent}>
              {/* Modal title */}
              <Text style={styles.title}>Student ID</Text>
              
              {/* Instructions for the user */}
              <Text style={styles.subtitle}>
                Enter in your Student ID manually, or scan your Student ID using the provided scanner.
              </Text>
              
              {/* Student ID input field */}
              <TextInput
                style={styles.input}
                value={studentId}
                onChangeText={setStudentId}
                placeholder="Student ID"
                placeholderTextColor="#999"
                keyboardType="numeric" // Show numeric keyboard
                autoCapitalize="characters" // Auto-capitalize input
                autoFocus={true} // Automatically focus when modal opens
              />
              
              {/* Button container for Close and Done buttons */}
              <View style={styles.buttonContainer}>
                {/* Close button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                
                {/* Done button - disabled when no input */}
                <TouchableOpacity
                  style={[styles.doneButton, !studentId.trim() && styles.doneButtonDisabled]}
                  onPress={handleDone}
                  disabled={!studentId.trim()} // Disable if no input
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
}

/**
 * StyleSheet for the SignOut component
 * Contains all styling definitions for the modal and its elements
 */
const styles = StyleSheet.create({
  // Semi-transparent overlay that covers the entire screen
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  // Background image container that fills the entire modal
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Additional overlay on top of background image to improve readability
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  // Main container that centers the modal content
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Styled card container for the modal content
  modalContent: {
    backgroundColor: 'rgba(74, 144, 164, 0.95)', // Blue with transparency
    borderRadius: 16,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  // Main title styling
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  // Subtitle/instruction text styling
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    opacity: 0.9,
  },
  // Student ID input field styling
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
  // Done button styling (submit button)
  doneButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    flex: 1,
    marginLeft: 12,
  },
  // Disabled state for done button
  doneButtonDisabled: {
    opacity: 0.5,
  },
  // Done button text styling
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Container for the Close and Done buttons
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  // Close button styling
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    flex: 1,
  },
  // Close button text styling
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});