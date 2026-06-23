// src/screens/WalletScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { WalletStackParamList } from '../types/navigation';
import COLORS from '../../constants/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';
import { AppHeader } from '../../components/AppHeader';
import { FloatingCard } from '../../components/FloatingCard';
import { SearchBar } from '../../components/SearchBar';
import { CredentialCard } from '../../components/CredentialCard';
import { Section } from '../../components/Section';
import { LoadingState } from '../../components/LoadingState';
import { Credential } from '../types';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x798f2bB3C65867B33D01Beb92D7E86a5e5F01F17";
const CONTRACT_ABI = [{"inputs":[{"internalType":"string","name":"_cid","type":"string"}],"name":"isRevoked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];

// ✅ UPDATED: Changed categories to Verification Statuses
const STATUS_FILTERS = [
  { id: 'all', label: 'All', icon: 'grid-outline' },
  { id: 'verified', label: 'Verified', icon: 'shield-checkmark-outline' },
  { id: 'revoked', label: 'Revoked', icon: 'warning-outline' },
];

type WalletScreenNavigationProp = StackNavigationProp<WalletStackParamList, 'WalletMain'>;

type Props = {
  navigation: WalletScreenNavigationProp;
};

export default function WalletScreen({ navigation }: Props) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all'); // State for our new filters
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLocalInventory();
  }, []);

  const loadLocalInventory = async () => {
    try {
      const rawStoredList = await AsyncStorage.getItem('anchor_secured_credentials');
      if (rawStoredList) {
        const parsedList = JSON.parse(rawStoredList);
        setCredentials(parsedList);
        syncBlockchainStatuses(parsedList);
      } else {
        setCredentials([]);
      }
    } catch (error) {
      console.log("Error loading wallet cache table entries:", error);
    }
  };

  const syncBlockchainStatuses = async (localCredentials: Credential[]) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const updatedCredentials = await Promise.all(localCredentials.map(async (cred: any) => {
        try {
          const targetCid = cred.rawIpfsCid || cred.id;
          if (targetCid && !targetCid.startsWith('cred-')) {
            const isRevokedOnChain = await contract.isRevoked(targetCid);
            return { ...cred, isRevoked: isRevokedOnChain };
          }
          return cred;
        } catch (e) {
          return cred;
        }
      }));

      setCredentials(updatedCredentials);
      await AsyncStorage.setItem('anchor_secured_credentials', JSON.stringify(updatedCredentials));
    } catch (error) {
      console.error("Failed to sync with Polygon:", error);
    }
  };

  // ✅ UPDATED: Logic now filters by isRevoked state instead of category
  const filteredCredentials = credentials.filter((credential: any) => {
    let matchesStatus = true;
    
    if (selectedStatus === 'verified') {
      matchesStatus = !credential.isRevoked; // Must not be revoked
    } else if (selectedStatus === 'revoked') {
      matchesStatus = credential.isRevoked === true; // Must be revoked
    }

    const matchesSearch = 
      (credential.title && credential.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (credential.issuer && credential.issuer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (credential.type && credential.type.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesStatus && matchesSearch;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLocalInventory();
    setRefreshing(false);
  };

  // Renders the new status buttons
  const renderFilterItem = ({ item }: { item: typeof STATUS_FILTERS[0] }) => {
    // Dynamic coloring for active states (Green for verified, Red for revoked)
    let activeColor = COLORS.primary;
    if (item.id === 'verified') activeColor = COLORS.success;
    if (item.id === 'revoked') activeColor = '#E53E3E';

    const isActive = selectedStatus === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          isActive && { backgroundColor: activeColor, borderColor: activeColor },
        ]}
        onPress={() => setSelectedStatus(item.id)}
      >
        <Ionicons
          name={item.icon as any}
          size={scale(18)}
          color={isActive ? COLORS.white : activeColor}
        />
        <Text
          style={[
            styles.categoryText,
            { color: isActive ? COLORS.white : activeColor },
            isActive && styles.categoryTextActive,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} tintColor={COLORS.primary} />
        }
      >
        <AppHeader 
          title="Wallet" 
          hasUnreadNotifications={false}
          onNotificationPress={() => {
            (navigation.getParent() as any)?.navigate('Notifications');
          }}
        />
        
        <FloatingCard offset={-60}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>My Credentials</Text>
            <Text style={styles.statsCount}>{filteredCredentials.length} stored</Text>
          </View>
          
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search credentials..." />
        </FloatingCard>

        <View style={styles.categorySection}>
          <FlatList
            data={STATUS_FILTERS}
            renderItem={renderFilterItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        <Section title={`${selectedStatus === 'all' ? 'All' : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Credentials`} showBackground={false} containerStyle={styles.credentialsSection}>
          {filteredCredentials.length > 0 ? (
            <FlatList
              data={filteredCredentials}
              renderItem={({ item }: { item: any }) => {
                if (item.isRevoked) {
                   return (
                     <TouchableOpacity activeOpacity={1} style={[styles.revokedCardContainer, { borderColor: '#E53E3E', borderWidth: 2 }]}>
                       <View style={styles.revokedOverlay} />
                       <View style={{ padding: spacing.md, opacity: 0.6 }}>
                         <Text style={{ fontSize: fontSize.lg, fontWeight: 'bold', textDecorationLine: 'line-through', color: COLORS.textDark }}>{item.title}</Text>
                         <Text style={{ color: COLORS.textGrey, marginTop: 4 }}>{item.issuer}</Text>
                       </View>
                       <View style={styles.revokedBadgeContainer}>
                         <View style={styles.revokedBadge}>
                           <Ionicons name="warning" size={16} color="white" />
                           <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 6, fontSize: 12 }}>Revoked by Issuer</Text>
                         </View>
                       </View>
                       <TouchableOpacity 
                         style={styles.revokedAction}
                         onPress={() => (navigation.getParent() as any)?.navigate('CredentialDetail', { credential: item })}
                       >
                         <Text style={{ color: '#E53E3E', fontWeight: '600' }}>View Details</Text>
                         <Ionicons name="chevron-forward" size={16} color="#E53E3E" />
                       </TouchableOpacity>
                     </TouchableOpacity>
                   );
                }
                
                return (
                  <CredentialCard
                    credential={item}
                    variant="detailed"
                    showActions={true}
                    onPress={() => {
                      (navigation.getParent() as any)?.navigate('CredentialDetail', { credential: item });
                    }}
                    onShare={() => Alert.alert('Verification Link', `Share this link with employers:\n\nhttps://anchor-portal.vercel.app/pages/verify.html?cid=${item.rawIpfsCid}`)}
                  />
                );
              }}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ListFooterComponent={<View style={styles.listFooter} />}
            />
          ) : (
            <LoadingState
              type="empty"
              message={searchQuery ? "No credentials match your search." : `You don't have any ${selectedStatus === 'all' ? '' : selectedStatus} credentials in your wallet.`}
              icon={selectedStatus === 'revoked' ? "shield-checkmark-outline" : "wallet-outline"}
            />
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
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  statsTitle: { fontSize: fontSize.lg, fontWeight: 'bold', color: COLORS.textDark },
  statsCount: { fontSize: fontSize.base, color: COLORS.primary, fontWeight: '600' },
  categorySection: { marginTop: spacing.md, paddingHorizontal: spacing.lg },
  categoryList: { paddingVertical: spacing.sm },
  categoryButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: spacing.lg, paddingVertical: scale(8), borderRadius: scale(20), marginRight: spacing.sm, borderWidth: 1, borderColor: COLORS.border },
  categoryText: { marginLeft: scale(6), fontSize: fontSize.sm, fontWeight: '600' },
  categoryTextActive: { fontWeight: 'bold' },
  credentialsSection: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  listFooter: { height: spacing.md },
  revokedCardContainer: { backgroundColor: 'white', borderRadius: scale(16), marginBottom: spacing.md, overflow: 'hidden', position: 'relative' },
  revokedOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(254, 226, 226, 0.3)', zIndex: 1 },
  revokedBadgeContainer: { position: 'absolute', top: spacing.md, right: spacing.md, zIndex: 2 },
  revokedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E53E3E', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  revokedAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderTopWidth: 1, borderTopColor: '#FED7D7', backgroundColor: '#FFF5F5', zIndex: 2 }
});