// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Clipboard,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppHeader } from '../../components/AppHeader';
import { Button } from '../../components/Button';
import { FloatingCard } from '../../components/FloatingCard';
import { Section } from '../../components/Section';
import COLORS from '../../constants/colors';
import { fontSize, scale, spacing } from '../../utils/responsive';

// CRYPTOGRAPHIC RUNTIME HANDLERS
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';
import { API_BASE_URL } from '../config/api';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Real-Time Sync States matched to HomeScreen
  const [userData, setUserData] = useState({ name: 'Anchor User', email: '', did: 'did:ethr:0x...' });
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [totalCredentials, setTotalCredentials] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    resolveActiveIdentity();
  }, []);

  const resolveActiveIdentity = async () => {
    try {
      setIsOffline(false);
      setIsLoading(true);

      const storedData = await SecureStore.getItemAsync('user_identity');
      if (storedData) {
        const { privateKey } = JSON.parse(storedData);
        const wallet = new ethers.Wallet(privateKey);
        const currentDid = `did:ethr:${wallet.address}`;

        setUserData(prev => ({ ...prev, did: currentDid }));

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); 

        const response = await fetch(`${API_BASE_URL}/api/users/${currentDid}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const data = await response.json();

        if (response.ok) {
          setUserData({ name: data.name, email: data.email, did: data.did });
          setEditName(data.name);
          setEditEmail(data.email);
          setIsOffline(false);
        } else {
          setIsOffline(true);
        }
      }

      const rawStoredList = await AsyncStorage.getItem('anchor_secured_credentials');
      if (rawStoredList) {
        setTotalCredentials(JSON.parse(rawStoredList).length);
      }
    } catch (error) {
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      id: '1',
      title: 'Account Settings',
      icon: 'person-outline',
      color: COLORS.blue,
      onPress: () => setShowEditModal(true),
    },
    {
      id: '2',
      title: 'About Anchor Wallet',
      icon: 'information-circle-outline',
      color: COLORS.textGrey,
      onPress: () => Alert.alert('About Core v1.0', 'W3C Compliant Academic Credential Passport Ledger Execution System.'),
    },
  ];

  const handleUpdateProfile = () => {
    Alert.alert('Success', 'Profile changes saved locally!');
    setUserData(prev => ({ ...prev, name: editName, email: editEmail }));
    setShowEditModal(false);
  };

  /**
   * 🔒 Action 1: Lock Wallet / Normal Log Out
   * Safely leaves keys encrypted on disk so biometrics can cleanly decrypt them later.
   */
  const handleLockWallet = () => {
    setShowLogoutModal(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' } as any],
    });
  };

  /**
   * 🚨 Action 2: Reset Wallet / Switch Account
   * Destroys everything on the system to provide a clean state for a completely new identity profile.
   */
  const handleHardResetWallet = async () => {
    setShowLogoutModal(false);
    await SecureStore.deleteItemAsync('user_identity');
    await AsyncStorage.removeItem('anchor_secured_credentials');
    await AsyncStorage.removeItem('anchor_read_notifications');
    
    Alert.alert("Wallet Reset", "All local cryptographic identity keys and cached credential records have been cleared safely.");
    
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' } as any],
    });
  };

  const formatDID = (did: string) => {
    if (did.length < 20) return did;
    return `${did.slice(0, 15)}...${did.slice(-4)}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <AppHeader 
          title="Profile" 
          hasUnreadNotifications={false}
          onNotificationPress={() => {
            (navigation as any).navigate('Notifications');
          }}
        />

        <FloatingCard offset={-60}>
          <View style={styles.cardHeader}>
            <View style={styles.avatarContainer}>
              {isLoading ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <Ionicons name="person" size={scale(30)} color={COLORS.primary} />
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <View style={styles.didContainer}>
                <Text style={styles.userDid}>{formatDID(userData.did)}</Text>
                <TouchableOpacity onPress={() => {
                  Clipboard.setString(userData.did);
                  Alert.alert("Copied!", "DID copied to clipboard");
                }}>
                  <Ionicons name="copy-outline" size={scale(14)} color={COLORS.textGrey} style={{ marginLeft: spacing.xs }} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={[
              styles.verifiedBadge, 
              { backgroundColor: isOffline ? '#FEE2E2' : COLORS.successLight }
            ]}>
              <Text style={[
                styles.verifiedText, 
                { color: isOffline ? '#EF4444' : COLORS.success }
              ]}>
                {isLoading ? 'Syncing...' : (isOffline ? 'Offline' : 'Verified')}
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalCredentials}</Text>
              <Text style={styles.statLabel}>Credentials</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>Polygon</Text>
              <Text style={styles.statLabel}>Network Anchor</Text>
            </View>
          </View>
        </FloatingCard>

        <Section title="Quick Settings">
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={scale(22)} color={COLORS.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
              </View>
            </View>
            <Switch value={isNotificationsEnabled} onValueChange={setIsNotificationsEnabled} trackColor={{ false: COLORS.grey, true: `${COLORS.primary}80` }} thumbColor={isNotificationsEnabled ? COLORS.primary : COLORS.white} />
          </View>
        </Section>

        <Section title="Menu">
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
              <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon as any} size={scale(22)} color={item.color} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={scale(20)} color={COLORS.textGrey} />
            </TouchableOpacity>
          ))}
        </Section>

        <View style={styles.logoutContainer}>
          <Button title="Security Options" onPress={() => setShowLogoutModal(true)} variant="danger" icon="log-out-outline" iconPosition="left" />
        </View>
      </ScrollView>

      {/* EDIT MODAL */}
      <Modal visible={showEditModal} animationType="slide" transparent={true} onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}><Ionicons name="close" size={24} color={COLORS.textDark} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name</Text>
                <TextInput style={styles.formInput} value={editName} onChangeText={setEditName} />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email Address</Text>
                <TextInput style={styles.formInput} value={editEmail} onChangeText={setEditEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowEditModal(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleUpdateProfile}><Text style={styles.modalSaveText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DUAL-WORKFLOW LOGOUT CONFIRMATION MODAL */}
      <Modal visible={showLogoutModal} animationType="fade" transparent={true} onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.logoutModalOverlay}>
          <View style={styles.logoutModalContainer}>
            <Text style={styles.logoutModalTitle}>Account Security Options</Text>
            <Text style={styles.logoutModalText}>
              Would you like to lock your wallet application view, or completely erase your local cryptographic keys to register a separate account identity profile?
            </Text>
            
            <View style={{ flexDirection: 'column', display: 'flex', width: '100%', gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={[styles.logoutConfirmButton, { backgroundColor: COLORS.primary, marginLeft: 0 }]} onPress={handleLockWallet}>
                <Text style={styles.logoutConfirmText}>Lock Wallet (Keep Keys)</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.logoutConfirmButton, { backgroundColor: COLORS.error, marginLeft: 0 }]} onPress={handleHardResetWallet}>
                <Text style={styles.logoutConfirmText}>Erase Keys / Switch Account</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.logoutCancelButton, { marginRight: 0, marginTop: 5 }]} onPress={() => setShowLogoutModal(false)}>
                <Text style={styles.logoutCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: spacing['2xl'] * 2.5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { width: scale(60), height: scale(60), borderRadius: scale(30), backgroundColor: COLORS.grey, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  userInfo: { flex: 1 },
  userName: { fontSize: fontSize.lg, fontWeight: 'bold', color: COLORS.textDark, marginBottom: spacing.xs },
  didContainer: { flexDirection: 'row', alignItems: 'center' },
  userDid: { fontSize: fontSize.sm, color: COLORS.textGrey },
  verifiedBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: scale(12), position: 'absolute', top: -5, right: -5 },
  verifiedText: { fontSize: fontSize.xs, fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: spacing.md, marginTop: spacing.md },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: fontSize.lg, fontWeight: 'bold', color: COLORS.textDark, marginBottom: spacing.xs },
  statLabel: { fontSize: fontSize.sm, color: COLORS.textGrey },
  statDivider: { width: 1, height: scale(30), backgroundColor: COLORS.border },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingTextContainer: { marginLeft: spacing.sm },
  settingTitle: { fontSize: fontSize.md, fontWeight: '600', color: COLORS.textDark },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIconContainer: { width: scale(40), height: scale(40), borderRadius: scale(12), justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm },
  menuText: { flex: 1, fontSize: fontSize.md, color: COLORS.textDark },
  logoutContainer: { marginHorizontal: spacing.lg, marginTop: spacing.lg },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  modalContent: { padding: 24 },
  formGroup: { marginBottom: 20 },
  formLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 8 },
  formInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 12, fontSize: 16, color: COLORS.textDark },
  modalFooter: { flexDirection: 'row', padding: 24, borderTopWidth: 1, borderTopColor: COLORS.border },
  modalCancelButton: { flex: 1, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, marginRight: 12 },
  modalCancelText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: COLORS.textGrey },
  modalSaveButton: { flex: 1, padding: 16, borderRadius: 8, backgroundColor: COLORS.primary, marginLeft: 12 },
  modalSaveText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: COLORS.white },
  logoutModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  logoutModalContainer: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, width: '100%', maxWidth: 400 },
  logoutModalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.textDark, textAlign: 'center', marginBottom: 12 },
  logoutModalText: { fontSize: 14, color: COLORS.textGrey, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  logoutCancelButton: { flex: 1, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 12 },
  logoutCancelText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: COLORS.textGrey },
  logoutConfirmButton: { width: '100%', padding: 16, borderRadius: 8, paddingVertical: 12, justifyContent: 'center', alignItems: 'center' },
  logoutConfirmText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: COLORS.white },
});