import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SignIn from '../components/signin';
import SignOut from '../components/signout';

export default function TabTwoScreen() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  const handleSignIn = () => {
    console.log('Sign In pressed');
    setShowSignIn(true);
  };

  const handleSignOut = () => {
    console.log('Sign Out pressed');
    setShowSignOut(true);
  };

  const handleSignInSubmit = (studentId: string) => {
    console.log('Student ID submitted:', studentId);
    setShowSignIn(false);
    setShowSignOut(false);
  };

  const handleSignInClose = () => {
    setShowSignIn(false);
  };

  const handleSignOutClose = () => {
    setShowSignOut(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{uri: 'https://jasmax.com/media_opt/Projects/Sacred-Heart-College/_1200x630_crop_center-center_none_ns/210101_00_JASMAX_SacredHeartCollege_N20.jpg'}}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.overlay}>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.signButton} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Sign-In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.signButton} onPress={handleSignOut}>
              <Text style={styles.buttonText}>Sign-Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <SignIn 
        visible={showSignIn}
        onClose={handleSignInClose}
        onSubmit={handleSignInSubmit}
      />      
      <SignOut 
        visible={showSignOut}
        onClose={handleSignOutClose}
        onSubmit={handleSignInSubmit}
      />
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
    height: '100%',
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
    paddingHorizontal: 150,
    paddingVertical: 90,
    borderRadius: 12,
    minWidth: 140,
    shadowColor: '#000',
    opacity: 0.8,
  },
  buttonText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
