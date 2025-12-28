// src/screens/NotificationsScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';
import { AppHeader } from '../../components/AppHeader';
import { FloatingCard } from '../../components/FloatingCard';
import { Section } from '../../components/Section';

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
            <Ionicons name={icon as any} size={scale(22)} color={color} />
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <AppHeader 
          title="Notifications" 
          showBackButton={true}
          showNotifications={false}
          onBackPress={() => navigation.goBack()}
        />
        
        <FloatingCard offset={-60}>
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
              <Ionicons name="checkmark-done" size={scale(20)} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Mark All Read</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={clearAllNotifications}
            >
              <Ionicons name="trash-outline" size={scale(20)} color={COLORS.error} />
              <Text style={[styles.quickActionText, { color: COLORS.error }]}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </FloatingCard>

        <Section title="Recent Notifications" showBackground={false} containerStyle={styles.notificationsSection}>
          
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
              <Ionicons name="notifications-off-outline" size={scale(64)} color={COLORS.grey} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptyText}>
                You're all caught up! New notifications will appear here.
              </Text>
            </View>
          )}
        </Section>

        <Section title="Notification Settings">
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="document-text-outline" size={scale(22)} color={COLORS.primary} />
              <Text style={styles.settingText}>Credential Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={scale(20)} color={COLORS.textGrey} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark-outline" size={scale(22)} color={COLORS.primary} />
              <Text style={styles.settingText}>Verification Alerts</Text>
            </View>
            <Ionicons name="chevron-forward" size={scale(20)} color={COLORS.textGrey} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="alert-circle-outline" size={scale(22)} color={COLORS.primary} />
              <Text style={styles.settingText}>Security Alerts</Text>
            </View>
            <Ionicons name="chevron-forward" size={scale(20)} color={COLORS.textGrey} />
          </TouchableOpacity>
        </Section>
      </ScrollView>
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
    paddingTop: 0, // No padding - FloatingCard will overlap header
    paddingBottom: spacing['2xl'] * 2.5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: fontSize['2xl'],
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
    height: scale(40),
    backgroundColor: COLORS.border,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: scale(8),
    backgroundColor: COLORS.lightGrey,
  },
  quickActionText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.base,
    fontWeight: '600',
    color: COLORS.primary,
  },
  notificationsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
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
    width: scale(40),
    height: scale(40),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    fontSize: fontSize.base,
    color: COLORS.textGrey,
    lineHeight: scale(18),
    marginBottom: spacing.xs,
  },
  notificationTime: {
    fontSize: fontSize.sm,
    color: COLORS.textGrey,
    opacity: 0.7,
  },
  unreadDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: COLORS.primary,
    marginLeft: spacing.sm,
  },
  actionButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: scale(6),
    borderRadius: scale(8),
    marginLeft: spacing.sm,
  },
  actionText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: spacing.xs,
  },
  listFooter: {
    height: scale(10),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.textGrey,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.base,
    color: COLORS.textGrey,
    textAlign: 'center',
    paddingHorizontal: spacing['2xl'],
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
  settingText: {
    fontSize: fontSize.md,
    color: COLORS.textDark,
    marginLeft: spacing.sm,
  },
});