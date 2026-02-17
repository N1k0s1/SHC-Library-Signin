/**
 * Connection Status Component
 * Shows the current status of the backend API connection
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApiConnection } from '../hooks/useApiConnection';

interface ConnectionStatusProps {
  showWhenConnected?: boolean;
  position?: 'top' | 'bottom';
}

export default function ConnectionStatus({ 
  showWhenConnected = false,
  position = 'top' 
}: ConnectionStatusProps) {
  const { isConnected, isChecking, error, checkConnection } = useApiConnection();

  // Don't show anything if connected and showWhenConnected is false
  if (isConnected && !showWhenConnected) {
    return null;
  }

  const getStatusColor = () => {
    if (isChecking) return '#f39c12'; // Orange
    if (isConnected) return '#27ae60'; // Green
    return '#e74c3c'; // Red
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking connection...';
    if (isConnected) return 'Connected to backend';
    return error || 'Backend disconnected';
  };

  const getStatusIcon = () => {
    if (isChecking) return '⏳';
    if (isConnected) return '✅';
    return '❌';
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: getStatusColor() },
      position === 'bottom' && styles.bottom
    ]}>
      <TouchableOpacity 
        style={styles.content} 
        onPress={checkConnection}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>{getStatusIcon()}</Text>
        <Text style={styles.text}>{getStatusText()}</Text>
        {!isConnected && !isChecking && (
          <Text style={styles.tapText}>Tap to retry</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 14,
    marginRight: 8,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  tapText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontStyle: 'italic',
  },
});