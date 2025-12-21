// screens/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- COLOR PALETTE ---
const COLORS = {
  primary: '#311F5A',
  secondary: '#4C35AA',
  white: '#FFFFFF',
  grey: '#F1F3F6',
  lightGrey: '#F8F9FA',
  textDark: '#1A202C',
  textGrey: '#718096',
  success: '#22543D',
  successLight: '#C6F6D5',
  warning: '#B45309',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  shadow: '#000000',
  border: '#E0E0E0',
  blue: '#2563EB',
  blueLight: '#DBEAFE',
};

// --- USER PROFILE DATA ---
const USER_PROFILE = {
  name: 'Usama Saleem',
  email: 'usama.saleem@example.com',
  did: 'did:ethr:0x1234...5678',
  joinDate: 'January 2024',
  avatar: '👤', // You can replace with actual image URL
};

export default function ProfileScreen({ navigation }: any) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [editName, setEditName] = useState(USER_PROFILE.name);
  const [editEmail, setEditEmail] = useState(USER_PROFILE.email);

  // --- UPDATED MENU ITEMS (Removed Security, Backup & Recovery) ---
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
      title: 'Connected Apps',
      icon: 'apps-outline',
      color: COLORS.secondary,
      onPress: () => Alert.alert('Connected Apps', 'Manage connected applications'),
    },
    {
      id: '3',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      color: COLORS.primary,
      onPress: () => Alert.alert('Help', 'Help center and support'),
    },
    {
      id: '4',
      title: 'About Anchor Wallet',
      icon: 'information-circle-outline',
      color: COLORS.textGrey,
      onPress: () => Alert.alert('About', 'Anchor Wallet v1.0.0\nBlockchain-based multi-credential wallet'),
    },
  ];

  // --- HANDLE PROFILE UPDATE ---
  const handleUpdateProfile = () => {
    // In real app, this would update the user profile
    Alert.alert('Success', 'Profile updated successfully!');
    setShowEditModal(false);
  };

  // --- HANDLE LOGOUT ---
  const handleLogout = () => {
    setShowLogoutModal(false);
    // Navigate back to login screen and reset navigation stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  // --- RENDER MENU ITEM ---
  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
        <Ionicons name={item.icon as any} size={22} color={item.color} />
      </View>
      <Text style={styles.menuText}>{item.title}</Text>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textGrey} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER SECTION (Same as HomeScreen) --- */}
        <View style={styles.header}>
          {/* Top Navigation Row */}
          <View style={styles.topNav}>
            <Text style={styles.appName}>Profile</Text>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
              {/* Notification Dot */}
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- IDENTITY CARD (Floating) --- */}
        <View style={styles.identityCard}>
          <View style={styles.cardHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{USER_PROFILE.avatar}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{USER_PROFILE.name}</Text>
              <View style={styles.didContainer}>
                <Text style={styles.userDid}>{USER_PROFILE.did}</Text>
                <TouchableOpacity onPress={() => Alert.alert('Copied', 'DID copied to clipboard')}>
                  <Ionicons name="copy-outline" size={14} color={COLORS.textGrey} style={{marginLeft: 4}}/>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setShowEditModal(true)}
            >
              <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>6</Text>
              <Text style={styles.statLabel}>Credentials</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Verifications</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{USER_PROFILE.joinDate}</Text>
              <Text style={styles.statLabel}>Member Since</Text>
            </View>
          </View>
        </View>

        {/* --- QUICK SETTINGS --- */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Quick Settings</Text>
          
          {/* Notifications */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingSubtitle}>Receive alerts and updates</Text>
              </View>
            </View>
            <Switch
              value={isNotificationsEnabled}
              onValueChange={setIsNotificationsEnabled}
              trackColor={{ false: COLORS.grey, true: `${COLORS.primary}80` }}
              thumbColor={isNotificationsEnabled ? COLORS.primary : COLORS.white}
            />
          </View>

          {/* Dark Mode */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={22} color={COLORS.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingSubtitle}>Switch to dark theme</Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: COLORS.grey, true: `${COLORS.primary}80` }}
              thumbColor={isDarkMode ? COLORS.primary : COLORS.white}
            />
          </View>
        </View>

        {/* --- MENU SECTION --- */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* --- LOGOUT BUTTON --- */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setShowLogoutModal(true)}
        >
          <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* --- APP VERSION --- */}
        <Text style={styles.versionText}>Anchor Wallet v1.0.0</Text>

      </ScrollView>

      {/* --- EDIT PROFILE MODAL --- */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your full name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email Address</Text>
                <TextInput
                  style={styles.formInput}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.modalNote}>
                Note: Your Decentralized Identifier (DID) cannot be changed as it is tied to your blockchain identity.
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.modalSaveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      <Modal
        visible={showLogoutModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.logoutModalOverlay}>
          <View style={styles.logoutModalContainer}>
            <View style={styles.logoutIconContainer}>
              <Ionicons name="log-out-outline" size={48} color={COLORS.error} />
            </View>
            <Text style={styles.logoutModalTitle}>Log Out</Text>
            <Text style={styles.logoutModalText}>
              Are you sure you want to log out? You'll need to sign in again to access your credentials.
            </Text>
            <View style={styles.logoutModalButtons}>
              <TouchableOpacity
                style={styles.logoutCancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.logoutCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutConfirmButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutConfirmText}>Log Out</Text>
              </TouchableOpacity>
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
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: COLORS.primary,
    height: 220,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 60,
    alignItems: 'flex-start',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  notificationBtn: {
    position: 'relative',
    padding: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  identityCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: -60,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  didContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDid: {
    fontSize: 12,
    color: COLORS.textGrey,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 20,
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textGrey,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  settingsSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTextContainer: {
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  settingSubtitle: {
    fontSize: 12,
    color: COLORS.textGrey,
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textDark,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: 24,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.errorLight,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 12,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textGrey,
    marginTop: 24,
    marginBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  modalContent: {
    padding: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.textDark,
  },
  modalNote: {
    fontSize: 12,
    color: COLORS.textGrey,
    fontStyle: 'italic',
    marginTop: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalCancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  modalCancelText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textGrey,
  },
  modalSaveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    marginLeft: 12,
  },
  modalSaveText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  logoutModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoutModalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  logoutIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  logoutModalText: {
    fontSize: 14,
    color: COLORS.textGrey,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  logoutModalButtons: {
    flexDirection: 'row',
  },
  logoutCancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  logoutCancelText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textGrey,
  },
  logoutConfirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: COLORS.error,
    marginLeft: 12,
  },
  logoutConfirmText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});