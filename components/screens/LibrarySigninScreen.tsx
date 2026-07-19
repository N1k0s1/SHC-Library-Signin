import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import ConnectionStatus from '@/components/ConnectionStatus';
import DebugPanel from '@/components/DebugPanel';
import LibrarySigninActionButton from '@/components/library/LibrarySigninActionButton';
import LibrarySigninBackground from '@/components/library/LibrarySigninBackground';
import LibrarySigninModals from '@/components/library/LibrarySigninModals';
import { getApiBaseUrl } from '@/constants/Api';
import { applyStoredApiConfig, saveApiConfig } from '@/services/ApiConfigService';

export default function LibrarySigninScreen() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiBaseUrlInput, setApiBaseUrlInput] = useState(getApiBaseUrl());
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savedApiKey, setSavedApiKey] = useState(false);

  useEffect(() => {
    applyStoredApiConfig()
      .then(() => setApiBaseUrlInput(getApiBaseUrl()))
      .catch(() => {
        // Keep default config when reading local settings fails.
      });
  }, []);

  const handleSignIn = () => {
    console.log('Sign In/Out pressed');
    setShowSignIn(true);
  };

  const handleSignInSubmit = (studentId: string) => {
    console.log('Student ID submitted:', studentId);
  };

  const handleSignInClose = () => {
    setShowSignIn(false);
  };

  const handleSignOutClose = () => {
    setShowSignOut(false);
  };

  const handleSaveApiConfig = async () => {
    const baseUrl = apiBaseUrlInput.trim();
    const apiKey = apiKeyInput.trim();

    if (!baseUrl || !apiKey) {
      Alert.alert('Missing fields', 'Please enter both server URL and API key.');
      return;
    }

    try {
      await saveApiConfig({ baseUrl, apiKey });
      setSavedApiKey(true);
      setApiKeyInput('');
      setShowApiConfig(false);
      Alert.alert('Saved', 'Local API settings have been saved on this device.');
    } catch (error) {
      Alert.alert('Save failed', error instanceof Error ? error.message : 'Could not save API settings');
    }
  };

  return (
    <View style={styles.container}>
      <LibrarySigninBackground>
        <View style={styles.buttonContainer}>
          <LibrarySigninActionButton onPress={handleSignIn} />
        </View>
      </LibrarySigninBackground>

      <LibrarySigninModals
        showSignIn={showSignIn}
        showSignOut={showSignOut}
        onCloseSignIn={handleSignInClose}
        onCloseSignOut={handleSignOutClose}
        onSubmit={handleSignInSubmit}
      />

      <View style={styles.footer} pointerEvents="none">
        <Text style={styles.footerText}>
          A Libthority product. About: built and maintained by Libthority.
        </Text>
        <Text style={styles.footerText}>© {new Date().getFullYear()} Libthority. All rights reserved.</Text>
      </View>

      <ConnectionStatus position="bottom" />
      <DebugPanel />

      <Pressable style={styles.configButton} onPress={() => setShowApiConfig(true)}>
        <Text style={styles.configButtonText}>⚙️</Text>
      </Pressable>

      <Modal visible={showApiConfig} transparent animationType="fade" onRequestClose={() => setShowApiConfig(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Local API Settings</Text>
            <Text style={styles.modalSubtitle}>This device will use these values for all requests.</Text>

            <TextInput
              value={apiBaseUrlInput}
              onChangeText={setApiBaseUrlInput}
              placeholder="https://your-server.vercel.app"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />

            <TextInput
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              placeholder={savedApiKey ? 'Saved (enter new key to replace)' : 'API key'}
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <Pressable style={styles.secondaryButton} onPress={() => setShowApiConfig(false)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.primaryButton} onPress={handleSaveApiConfig}>
                <Text style={styles.primaryButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  configButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  configButtonText: {
    fontSize: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalSubtitle: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 13,
    color: '#64748b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontWeight: '600',
  },
});
