import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ConnectionStatus from '../components/ConnectionStatus';
import DebugPanel from '../components/DebugPanel';
import SignIn from '../components/signin';
import SignOut from '../components/signout';

/**
 * TabTwoScreen Component (Library Sign-In Screen)
 * Main screen component for the library sign-in/out application
 * Displays a single button that opens a modal for student ID entry
 * Handles both sign-in and sign-out functionality through the same interface
 */
export default function TabTwoScreen() {
  // State to control visibility of the SignIn modal
  const [showSignIn, setShowSignIn] = useState(false);
  // State to control visibility of the SignOut modal (currently unused)
  const [showSignOut, setShowSignOut] = useState(false);

  /**
   * Handles the main sign-in/out button press
   * Opens the SignIn modal which handles both sign-in and sign-out logic
   */
  const handleSignIn = () => {
    console.log('Sign In/Out pressed');
    setShowSignIn(true);
  };

  /**
   * Handles sign-out functionality (currently unused)
   * Note: Currently uses the same modal as sign-in
   */
  const handleSignOut = () => {
    console.log('Sign In/Out pressed');
    setShowSignIn(true); // Use the same modal for both
  };

  /**
   * Handles the submission of student ID from either modal
   * Closes both modals and logs the submitted student ID
   * 
   * @param studentId - The student ID entered by the user
   */
  const handleSignInSubmit = (studentId: string) => {
    console.log('Student ID submitted:', studentId);
    // Do not immediately close the modal here.
    // The SignIn component handles showing a success screen and closes itself after a short delay.
    // Keeping the modal open allows the success message to remain visible to the user.
  };

  /**
   * Handles closing the SignIn modal
   */
  const handleSignInClose = () => {
    setShowSignIn(false);
  };

  /**
   * Handles closing the SignOut modal
   */
  const handleSignOutClose = () => {
    setShowSignOut(false);
  };

  return (
    // Main container for the entire screen
    <View style={styles.container}>
      {/* Background image with Sacred Heart College photo */}
      <ImageBackground
        source={{uri: 'https://images.squarespace-cdn.com/content/v1/595c349a86e6c029dc2cb08b/1531796849464-D1CE8QPYI63K3WMY76O8/Jason_Mann_Sacredheart_002.jpg?format=1500w'}}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle} // Applies opacity to the image
      >
        {/* Overlay container that centers the main button */}
        <View style={styles.overlay}>
          
          {/* Container for the main sign-in/out button */}
          <View style={styles.buttonContainer}>
            {/* Main library sign-in/out button */}
            <TouchableOpacity style={styles.signButton} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Library Sign-In/Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* SignIn modal component - handles both sign-in and sign-out */}
      <SignIn 
        visible={showSignIn}
        onClose={handleSignInClose}
        onSubmit={handleSignInSubmit}
      />      
      
      {/* SignOut modal component - currently unused but kept for future use */}
      <SignOut 
        visible={showSignOut}
        onClose={handleSignOutClose}
        onSubmit={handleSignInSubmit}
      />
      
      {/* Connection Status - shows at bottom when disconnected */}
      <ConnectionStatus position="bottom" />
      
      {/* Debug Panel - only in development */}
      <DebugPanel />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '110%',
  },
    backgroundImageStyle: {
      opacity: 0.6,
    },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    color: '#555',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signButton: {
    backgroundColor: '#335E7A',
    paddingHorizontal: 60,
    paddingVertical: 90,
    borderRadius: 12,
    minWidth: 400,
    shadowColor: '#000',
    opacity: 0.8,
  },
  buttonText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
