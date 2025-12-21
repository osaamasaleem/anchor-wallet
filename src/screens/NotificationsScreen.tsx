// src/screens/NotificationsScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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
  info: '#2563EB',
  infoLight: '#DBEAFE',
};

// --- NOTIFICATION TYPES ---
type NotificationType = 'verification' | 'credential' | 'security' | 'system';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  read: boolean;
  action?: string;
}

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Credential Received',
      message: 'Foundation University issued you a new credential: Bachelor of Science',
      type: 'credential',
      time: '10 min ago',
      read: false,
      action: 'View Credential',
    },
    {
      id: '2',
      title: 'Verification Request',
      message: 'Meta Developer Circle requested to verify your React Native Certification',
      type: 'verification',
      time: '1 hour ago',
      read: false,
      action: 'Verify',
    },
    {
      id: '3',
      title: 'Credential Expiring Soon',
      message: 'Your Driving License expires in 30 days. Renew it soon.',
      type: 'security',
      time: '2 hours ago',
      read: true,
      action: 'Renew',
    },
    {
      id: '4',
      title: 'New Feature Available',
      message: 'Try the new QR code scanner for instant credential verification',
      type: 'system',
      time: '1 day ago',
      read: true,
    },
    {
      id: '5',
      title: 'Security Alert',
      message: 'New login detected from a different device. Was this you?',
      type: 'security',
      time: '2 days ago',
      read: true,
    },
    {
      id: '6',
      title: 'Credential Verified',
      message: 'Your National Identity Card has been successfully verified',
      type: 'verification',
      time: '3 days ago',
      read: true,
    },
  ]);

  // --- MARK AS READ ---
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // --- MARK ALL AS READ ---
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    Alert.alert('Success', 'All notifications marked as read');
  };

  // --- CLEAR ALL NOTIFICATIONS ---
  const clearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            setNotifications([]);
            Alert.alert('Cleared', 'All notifications have been cleared');
          }
        },
      ]
    );
  };

  // --- GET NOTIFICATION ICON ---
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'verification':
        return { icon: 'shield-checkmark', color: COLORS.success };
      case 'credential':
        return { icon: 'document-text', color: COLORS.info };
      case 'security':
        return { icon: 'alert-circle', color: COLORS.warning };
      case 'system':
        return { icon: 'information-circle', color: COLORS.primary };
      default:
        return { icon: 'notifications', color: COLORS.textGrey };
    }
  };

  // --- HANDLE NOTIFICATION PRESS ---
  const handleNotificationPress = (notification: Notification) => {
    // Mark as read when pressed
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Handle different notification actions
    switch (notification.type) {
      case 'credential':
        Alert.alert('View Credential', 'Would open credential details screen');
        break;
      case 'verification':
        Alert.alert('Verification', 'Would open verification screen');
        break;
      case 'security':
        Alert.alert('Security', 'Would open security settings');
        break;
      default:
        // Just mark as read for system notifications
        break;
    }
  };

  // --- RENDER NOTIFICATION ITEM ---
  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const { icon, color } = getNotificationIcon(item.type);
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.read && styles.unreadNotification,
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.notificationLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
            <Ionicons name={icon as any} size={22} color={color} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {item.message}
            </Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
        </View>
        
        {!item.read && (
          <View style={styles.unreadDot} />
        )}
        
        {item.action && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: `${color}20` }]}
            onPress={() => Alert.alert(item.action!, `Performing: ${item.action}`)}
          >
            <Text style={[styles.actionText, { color }]}>{item.action}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER SECTION --- */}
        <View style={styles.header}>
          {/* Top Navigation Row */}
          <View style={styles.topNav}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.appName}>Notifications</Text>
            <TouchableOpacity style={styles.emptyButton} />
          </View>
        </View>

        {/* --- NOTIFICATIONS STATS CARD --- */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {notifications.filter(n => !n.read).length}
              </Text>
              <Text style={styles.statLabel}>Unread</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{notifications.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {notifications.filter(n => n.type === 'credential').length}
              </Text>
              <Text style={styles.statLabel}>Credentials</Text>
            </View>
          </View>
          
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={markAllAsRead}
            >
              <Ionicons name="checkmark-done" size={20} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Mark All Read</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={clearAllNotifications}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              <Text style={[styles.quickActionText, { color: COLORS.error }]}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- NOTIFICATIONS LIST --- */}
        <View style={styles.notificationsSection}>
          <Text style={styles.sectionTitle}>
            Recent Notifications
          </Text>
          
          {notifications.length > 0 ? (
            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false} // Since we're in a ScrollView
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListFooterComponent={<View style={styles.listFooter} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={64} color={COLORS.grey} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptyText}>
                You're all caught up! New notifications will appear here.
              </Text>
            </View>
          )}
        </View>

        {/* --- NOTIFICATION SETTINGS --- */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="document-text-outline" size={22} color={COLORS.primary} />
              <Text style={styles.settingText}>Credential Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textGrey} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.primary} />
              <Text style={styles.settingText}>Verification Alerts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textGrey} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="alert-circle-outline" size={22} color={COLORS.primary} />
              <Text style={styles.settingText}>Security Alerts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textGrey} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  emptyButton: {
    width: 40,
  },
  statsCard: {
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
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
    height: 40,
    backgroundColor: COLORS.border,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.lightGrey,
  },
  quickActionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  notificationsSection: {
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
    marginBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  unreadNotification: {
    backgroundColor: `${COLORS.primary}05`,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.textGrey,
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.textGrey,
    opacity: 0.7,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  listFooter: {
    height: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textGrey,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textGrey,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  settingsSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
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
  settingText: {
    fontSize: 16,
    color: COLORS.textDark,
    marginLeft: 12,
  },
});