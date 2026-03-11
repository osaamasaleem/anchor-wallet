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

// CRYPTO & STORAGE IMPORTS
import * as SecureStore from 'expo-secure-store';
import { ethers } from 'ethers';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeMain'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [refreshing, setRefreshing] = useState(false); // New state

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadUserIdentity(); // Re-run the sync logic
    setRefreshing(false);
  }, []);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  
  // --- STATE MANAGEMENT ---
  const [userData, setUserData] = useState({ name: 'Anchor User', did: 'did:ethr:0x...' });
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    loadUserIdentity();
  }, []);

  const loadUserIdentity = async () => {
    try {
      setIsOffline(false);
      setIsLoading(true);

      // 1. Get the Identity from LOCAL storage first
      const storedData = await SecureStore.getItemAsync('user_identity');
      
      if (storedData) {
        const { privateKey } = JSON.parse(storedData);
        
        // 2. Derive the Wallet and DID locally (This must happen BEFORE fetch)
        const wallet = new ethers.Wallet(privateKey);
        const currentDid = `did:ethr:${wallet.address}`;

        // Set local DID immediately so UI is populated
        setUserData(prev => ({ ...prev, did: currentDid }));

        // 3. Setup Server Call with 5-Second Timer
        const API_URL = 'http://192.168.18.112:5000'; 
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); 

        // 4. Perform the Fetch
        const response = await fetch(`${API_URL}/api/users/${currentDid}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const data = await response.json();

        if (response.ok) {
          setUserData({ name: data.name, did: data.did });
          setIsOffline(false);
          console.log("✅ Profile Synced Successfully");
        } else {
          console.log("⚠️ User found locally but not in Backend DB");
          setIsOffline(true);
        }
      } else {
        console.log("❌ No identity found in SecureStore");
      }
      
    } catch (error) {
      console.log("🏠 Home Load Result: Operating in Offline Mode.");
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDID = (did: string) => {
    if (did.length < 20) return did;
    return `${did.slice(0, 15)}...${did.slice(-4)}`;
  };

  const recentCredentials = [
    {
      id: '1',
      title: 'Bachelor of Science',
      issuer: 'Foundation University',
      issueDate: '2023-11-01',
      expiryDate: null,
      type: 'Degree',
      status: 'valid' as const,
      verified: true,
      category: 'education' as const,
      logo: '🏛️',
      color: '#4F46E5',
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        refreshControl={
    <RefreshControl 
      refreshing={refreshing} 
      onRefresh={onRefresh} 
      tintColor={COLORS.primary} // iOS Spinner Color
      colors={[COLORS.primary]} // Android Spinner Color
    />
  }
      >
        <AppHeader 
          title="Anchor" 
          hasUnreadNotifications={hasUnreadNotifications}
          onNotificationPress={() => {
            (navigation.getParent() as any)?.navigate('Notifications');
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
        </FloatingCard>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#E0D4FC' }]}>
              <Ionicons name="qr-code-outline" size={scale(32)} color={COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Scan QR</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Share.share({ message: `My Anchor DID: ${userData.did}` })}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#E0F2F1' }]}>
              <Ionicons name="share-social-outline" size={scale(32)} color={COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Share ID</Text>
          </TouchableOpacity>
        </View>

        <Section title="Recent Credentials" showBackground={false} containerStyle={styles.recentSection}>
          {recentCredentials.map((credential) => (
            <CredentialCard
              key={credential.id}
              credential={credential}
              variant="compact"
              onPress={() => {
                (navigation.getParent() as any)?.navigate('CredentialDetail', { credential });
              }}
            />
          ))}
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
  avatarContainer: {
    width: scale(60), height: scale(60), borderRadius: scale(30),
    backgroundColor: COLORS.grey, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: fontSize.lg, fontWeight: 'bold', color: COLORS.textDark, marginBottom: spacing.xs },
  didContainer: { flexDirection: 'row', alignItems: 'center' },
  userDid: { fontSize: fontSize.sm, color: COLORS.textGrey },
  verifiedBadge: {
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: scale(12), position: 'absolute', top: -5, right: -5,
  },
  verifiedText: { fontSize: fontSize.xs, fontWeight: 'bold' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  actionButton: {
    backgroundColor: COLORS.white, width: '47%', paddingVertical: spacing.md, borderRadius: scale(16),
    alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.shadow, elevation: 2,
  },
  iconCircle: { width: scale(60), height: scale(60), borderRadius: scale(30), justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  actionText: { fontSize: fontSize.md, fontWeight: '600', color: COLORS.primary },
  recentSection: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
});