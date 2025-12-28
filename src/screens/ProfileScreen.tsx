// screens/ProfileScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { Button } from '../../components/Button';
import { FloatingCard } from '../../components/FloatingCard';
import { Section } from '../../components/Section';
import COLORS from '../../constants/colors';
import { fontSize, scale, spacing } from '../../utils/responsive';

// --- USER PROFILE DATA ---
const USER_PROFILE = {
  name: 'Usama Saleem',
  email: 'usama.saleem@example.com',
  did: 'did:ethr:0x1234...5678',
  joinDate: 'January 2024',
  avatar: '👤', // You can replace with actual image URL
};

export default function ProfileScreen({ navigation: navProp }: any) {
  const navigation = useNavigation();
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
        <Ionicons name={item.icon as any} size={scale(22)} color={item.color} />
      </View>
      <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={scale(20)} color={COLORS.textGrey} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        
        <AppHeader 
          title="Profile" 
          hasUnreadNotifications={true}
          onNotificationPress={() => {
            (navigation.getParent() as any)?.navigate('Notifications');
          }}
        />

        <FloatingCard offset={-60}>
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
        </FloatingCard>

        <Section title="Quick Settings">
          
          {/* Notifications */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={scale(22)} color={COLORS.primary} />
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
              <Ionicons name="moon-outline" size={scale(22)} color={COLORS.primary} />
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
        </Section>

        <Section title="Menu">
          {menuItems.map(renderMenuItem)}
        </Section>

        <View style={styles.logoutContainer}>
          <Button
            title="Log Out"
            onPress={() => setShowLogoutModal(true)}
            variant="danger"
            icon="log-out-outline"
            iconPosition="left"
            style={styles.logoutButton}
          />
        </View>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'] * 2.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: COLORS.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: fontSize['2xl'],
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: spacing.xs,
  },
  didContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDid: {
    fontSize: fontSize.sm,
    color: COLORS.textGrey,
  },
  editButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
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
    paddingTop: spacing.md,
    marginTop: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: COLORS.textGrey,
  },
  statDivider: {
    width: 1,
    height: scale(30),
    backgroundColor: COLORS.border,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTextContainer: {
    marginLeft: spacing.sm,
  },
  settingTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  settingSubtitle: {
    fontSize: fontSize.sm,
    color: COLORS.textGrey,
    marginTop: scale(2),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  menuText: {
    flex: 1,
    fontSize: fontSize.md,
    color: COLORS.textDark,
  },
  logoutContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  logoutButton: {
    // Don't override backgroundColor, let Button component handle it
  },
  versionText: {
    textAlign: 'center',
    fontSize: fontSize.sm,
    color: COLORS.textGrey,
    marginTop: spacing.lg,
    marginBottom: spacing['2xl'],
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