// src/screens/NotificationsScreen.tsx
import React, { useState, useEffect } from 'react';
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

import AsyncStorage from '@react-native-async-storage/async-storage';

type NotificationType = 'verification' | 'credential' | 'security' | 'system';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  read: boolean;
  rawCredentialData?: any; // Links notification directly to its verifiable credential data structure
}

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadRealTimeNotifications();
  }, []);

  const loadRealTimeNotifications = async () => {
    try {
      const rawStoredList = await AsyncStorage.getItem('anchor_secured_credentials');
      const realCredentials = rawStoredList ? JSON.parse(rawStoredList) : [];
      
      const rawReadIds = await AsyncStorage.getItem('anchor_read_notifications');
      const readNotificationIds = rawReadIds ? JSON.parse(rawReadIds) : [];

      const synthesizedAlerts: Notification[] = [];

      // Core System Base Registration Notification
      const isWelcomeRead = readNotificationIds.includes('sys-1');
      synthesizedAlerts.push({
        id: 'sys-1',
        title: 'Anchor Wallet Secured',
        message: 'Your cryptographic identity keys are verified and locally locked.',
        type: 'system',
        time: 'Active Now',
        read: isWelcomeRead,
      });

      // Map credentials directly to structured notification items
      realCredentials.forEach((cred: any) => {
        const notifId = `notif-cred-${cred.id}`;
        const isAlreadyRead = readNotificationIds.includes(notifId);

        synthesizedAlerts.unshift({
          id: notifId,
          title: 'New Credential Added',
          message: `Successfully accepted signed "${cred.title}" record into your wallet container layout.`,
          type: 'credential',
          time: cred.issueDate || 'Recent',
          read: isAlreadyRead,
          rawCredentialData: cred // Store document context for deep link lookups
        });
      });

      setNotifications(synthesizedAlerts);
    } catch (error) {
      console.log("Error binding notifications engine dynamic mapping vectors:", error);
    }
  };

  const handleNotificationPress = async (item: Notification) => {
    try {
      const rawReadIds = await AsyncStorage.getItem('anchor_read_notifications');
      const readNotificationIds = rawReadIds ? JSON.parse(rawReadIds) : [];

      if (!readNotificationIds.includes(item.id)) {
        readNotificationIds.push(item.id);
        await AsyncStorage.setItem('anchor_read_notifications', JSON.stringify(readNotificationIds));
      }

      // Mark local runtime status as read immediately
      setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));

      // Deep link routing check handler
      if (item.type === 'credential' && item.rawCredentialData) {
        console.log(`Deep routing straight down toward target credential identifier context: ${item.rawCredentialData.id}`);
        (navigation as any).navigate('CredentialDetail', { credential: item.rawCredentialData });
      }
    } catch (error) {
      console.log("Handshake navigation parsing failure exception:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const allIds = notifications.map(n => n.id);
      await AsyncStorage.setItem('anchor_read_notifications', JSON.stringify(allIds));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      Alert.alert('Success', 'All notifications synchronized as read.');
    } catch (error) {
      console.log(error);
    }
  };

  const clearAllNotifications = async () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear your alerts log?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => setNotifications([]) },
      ]
    );
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'verification': return { icon: 'shield-checkmark', color: COLORS.success };
      case 'credential': return { icon: 'document-text', color: COLORS.info };
      case 'security': return { icon: 'alert-circle', color: COLORS.warning };
      case 'system': return { icon: 'information-circle', color: COLORS.primary };
      default: return { icon: 'notifications', color: COLORS.textGrey };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <AppHeader title="Notifications" showBackButton={true} showNotifications={false} onBackPress={() => navigation.goBack()} />
        
        <FloatingCard offset={-60}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{notifications.filter(n => !n.read).length}</Text>
              <Text style={styles.statLabel}>Unread</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{notifications.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{notifications.filter(n => n.type === 'credential').length}</Text>
              <Text style={styles.statLabel}>Credentials</Text>
            </View>
          </View>
          
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton} onPress={markAllAsRead}>
              <Ionicons name="checkmark-done" size={scale(20)} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Mark All Read</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton} onPress={clearAllNotifications}>
              <Ionicons name="trash-outline" size={scale(20)} color={COLORS.error} />
              <Text style={[styles.quickActionText, { color: COLORS.error }]}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </FloatingCard>

        <Section title="Recent Notifications" showBackground={false} containerStyle={styles.notificationsSection}>
          {notifications.length > 0 ? (
            <FlatList
              data={notifications}
              renderItem={({ item }) => {
                const { icon, color } = getNotificationIcon(item.type);
                return (
                  <TouchableOpacity style={[styles.notificationItem, !item.read && styles.unreadNotification]} onPress={() => handleNotificationPress(item)}>
                    <View style={styles.notificationLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}><Ionicons name={icon as any} size={scale(22)} color={color} /></View>
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationTitle}>{item.title}</Text>
                        <Text style={styles.notificationMessage} numberOfLines={2}>{item.message}</Text>
                        <Text style={styles.notificationTime}>{item.time}</Text>
                      </View>
                    </View>
                    {!item.read && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={scale(64)} color={COLORS.grey} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
            </View>
          )}
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 0, paddingBottom: spacing['2xl'] * 2.5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: spacing.md },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: fontSize['2xl'], fontWeight: 'bold', color: COLORS.textDark, marginBottom: spacing.xs },
  statLabel: { fontSize: fontSize.sm, color: COLORS.textGrey },
  statDivider: { width: 1, height: scale(40), backgroundColor: COLORS.border },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  quickActionButton: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm, borderRadius: scale(8), backgroundColor: COLORS.lightGrey },
  quickActionText: { marginLeft: spacing.sm, fontSize: fontSize.base, fontWeight: '600', color: COLORS.primary },
  notificationsSection: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  notificationItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  unreadNotification: { backgroundColor: `${COLORS.primary}05` },
  notificationLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  iconContainer: { width: scale(40), height: scale(40), borderRadius: scale(12), justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm },
  notificationContent: { flex: 1 },
  notificationTitle: { fontSize: fontSize.md, fontWeight: '600', color: COLORS.textDark, marginBottom: spacing.xs },
  notificationMessage: { fontSize: fontSize.base, color: COLORS.textGrey, lineHeight: scale(18), marginBottom: spacing.xs },
  notificationTime: { fontSize: fontSize.sm, color: COLORS.textGrey, opacity: 0.7 },
  unreadDot: { width: scale(8), height: scale(8), borderRadius: scale(4), backgroundColor: COLORS.primary, marginLeft: spacing.sm },
  separator: { height: 1, backgroundColor: COLORS.border, marginVertical: spacing.xs },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing['2xl'] },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: 'bold', color: COLORS.textGrey, marginTop: spacing.md },
});