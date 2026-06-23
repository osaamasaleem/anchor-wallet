// src/screens/HomeScreen.tsx
import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  ActivityIndicator,
  Clipboard,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../types/navigation';
import COLORS from '../../constants/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';
import { AppHeader } from '../../components/AppHeader';
import { FloatingCard } from '../../components/FloatingCard';
import { CredentialCard } from '../../components/CredentialCard';
import { Section } from '../../components/Section';

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeMain'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [userData, setUserData] = useState({ name: 'Anchor User', did: 'did:ethr:0x...' });
  const [credentialsList, setCredentialsList] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const focusUnsubscribe = navigation.addListener('focus', () => {
      loadUserIdentity(); // Reload inventory lists and alert state monitors when screen regains focus
    });
    return focusUnsubscribe;
  }, [navigation]);

  const loadUserIdentity = async () => {
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
          setUserData({ name: data.name, did: data.did });
          setIsOffline(false);
        } else {
          setIsOffline(true);
        }
      }

      const rawStoredList = await AsyncStorage.getItem('anchor_secured_credentials');
      const parsedCredentials = rawStoredList ? JSON.parse(rawStoredList) : [];
      setCredentialsList(parsedCredentials);

      // ✅ FIXED: Calculate the global unread badge state precisely
      const rawReadIds = await AsyncStorage.getItem('anchor_read_notifications');
      const readNotificationIds = rawReadIds ? JSON.parse(rawReadIds) : [];
      
      const totalSystemNotifsCount = parsedCredentials.length + 1; // Credentials count + Welcome banner
      setHasUnreadNotifications(readNotificationIds.length < totalSystemNotifsCount);

    } catch (error) {
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDID = (did: string) => {
    if (did.length < 20) return did;
    return `${did.slice(0, 15)}...${did.slice(-4)}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await loadUserIdentity(); setRefreshing(false); }} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
      >
        <AppHeader title="Anchor" hasUnreadNotifications={hasUnreadNotifications} onNotificationPress={() => (navigation as any).navigate('Notifications')} />
        
        <FloatingCard offset={-60}>
          <View style={styles.cardHeader}>
            <View style={styles.avatarContainer}>
              {isLoading ? <ActivityIndicator color={COLORS.primary} /> : <Ionicons name="person" size={scale(30)} color={COLORS.primary} />}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <View style={styles.didContainer}>
                <Text style={styles.userDid}>{formatDID(userData.did)}</Text>
                <TouchableOpacity onPress={() => { Clipboard.setString(userData.did); Alert.alert("Copied!", "DID copied to clipboard"); }}>
                  <Ionicons name="copy-outline" size={scale(14)} color={COLORS.textGrey} style={{ marginLeft: spacing.xs }} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.verifiedBadge, { backgroundColor: isOffline ? '#FEE2E2' : COLORS.successLight }]}>
              <Text style={[styles.verifiedText, { color: isOffline ? '#EF4444' : COLORS.success }]}>{isLoading ? 'Syncing...' : (isOffline ? 'Offline' : 'Verified')}</Text>
            </View>
          </View>
        </FloatingCard>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('QRScanner' as any)}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0D4FC' }]}><Ionicons name="qr-code-outline" size={scale(32)} color={COLORS.primary} /></View>
            <Text style={styles.actionText}>Scan QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => Share.share({ message: `My Anchor DID: ${userData.did}` })}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0F2F1' }]}><Ionicons name="share-social-outline" size={scale(32)} color={COLORS.primary} /></View>
            <Text style={styles.actionText}>Share ID</Text>
          </TouchableOpacity>
        </View>

        <Section title="Recent Credentials" showBackground={false} containerStyle={styles.recentSection}>
          {credentialsList.length > 0 ? (
            credentialsList.map((credential) => (
              <CredentialCard key={credential.id} credential={credential} variant="compact" onPress={() => (navigation as any).navigate('CredentialDetail', { credential })} />
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="school-outline" size={scale(48)} color={COLORS.textGrey} style={{ opacity: 0.4 }} />
              <Text style={styles.emptyStateTitle}>Your Wallet is Empty</Text>
              <Text style={styles.emptyStateSubtitle}>Degrees issued by authorized universities will appear here once you scan their claim link QR codes.</Text>
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
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { width: scale(60), height: scale(60), borderRadius: scale(30), backgroundColor: COLORS.grey, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  userInfo: { flex: 1 },
  userName: { fontSize: fontSize.lg, fontWeight: 'bold', color: COLORS.textDark, marginBottom: spacing.xs },
  didContainer: { flexDirection: 'row', alignItems: 'center' },
  userDid: { fontSize: fontSize.sm, color: COLORS.textGrey },
  verifiedBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: scale(12), position: 'absolute', top: -5, right: -5 },
  verifiedText: { fontSize: fontSize.xs, fontWeight: 'bold' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  actionButton: { backgroundColor: COLORS.white, width: '47%', paddingVertical: spacing.md, borderRadius: scale(16), alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.shadow, elevation: 2 },
  iconCircle: { width: scale(60), height: scale(60), borderRadius: scale(30), justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  actionText: { fontSize: fontSize.md, fontWeight: '600', color: COLORS.primary },
  recentSection: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderRadius: scale(16), paddingVertical: spacing.xl * 1.5, paddingHorizontal: spacing.lg, marginTop: spacing.sm, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  emptyStateTitle: { fontSize: fontSize.md, fontWeight: '700', color: COLORS.textDark, marginTop: spacing.sm, marginBottom: spacing.xs },
  emptyStateSubtitle: { fontSize: fontSize.sm, color: COLORS.textGrey, textAlign: 'center', lineHeight: 18, paddingHorizontal: spacing.md }
});