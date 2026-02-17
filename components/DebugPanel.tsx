/**
 * Development Debug Panel
 * Only shows in development mode
 * Provides quick access to test API functionality
 */

import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { apiService } from '../services/ApiService';
import IntegrationTester from '../utils/IntegrationTester';

export default function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Only show in development
  if (!__DEV__) {
    return null;
  }

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const result = await apiService.checkHealth();
      Alert.alert(
        'Health Check',
        result.success ? 'Backend is healthy!' : 'Backend health check failed',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Health Check Error',
        error instanceof Error ? error.message : 'Unknown error',
        [{ text: 'OK' }]
      );
    }
    setIsLoading(false);
  };

  const runFullTests = async () => {
    setIsLoading(true);
    try {
      await IntegrationTester.runTests();
      Alert.alert('Tests Complete', 'Check console for results', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert(
        'Test Error',
        error instanceof Error ? error.message : 'Unknown error',
        [{ text: 'OK' }]
      );
    }
    setIsLoading(false);
  };

  const testStudentToggle = async () => {
    setIsLoading(true);
    try {
      const result = await apiService.toggleStudentSignInOut('99999');
      Alert.alert(
        'Test Result',
        `Action: ${result.action}\nMessage: ${result.message}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Test Error',
        error instanceof Error ? error.message : 'Unknown error',
        [{ text: 'OK' }]
      );
    }
    setIsLoading(false);
  };

  if (!isVisible) {
    return (
      <TouchableOpacity 
        style={styles.toggleButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.toggleText}>🔧</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Debug Panel</Text>
        <TouchableOpacity onPress={() => setIsVisible(false)}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={runHealthCheck}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Health Check</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={testStudentToggle}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Toggle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={runFullTests}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Run All Tests</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  toggleText: {
    fontSize: 20,
  },
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 10,
    padding: 15,
    zIndex: 1000,
    minWidth: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    color: 'white',
    fontSize: 18,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});