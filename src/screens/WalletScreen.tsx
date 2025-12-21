// src/screens/WalletScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import navigation types
import { StackNavigationProp } from '@react-navigation/stack';
import { WalletStackParamList } from '../navigation/WalletStack'; // Import WalletStack types

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
};

// --- DUMMY DATA FOR CREDENTIALS ---
const DUMMY_CREDENTIALS = [
  {
    id: '1',
    title: 'Bachelor of Science in Computer Science',
    issuer: 'Foundation University Islamabad',
    issueDate: '2023-06-15',
    expiryDate: null,
    type: 'Degree',
    status: 'valid',
    verified: true,
    category: 'education',
    logo: '🏛️',
    color: '#4F46E5',
  },
  {
    id: '2',
    title: 'React Native Developer Certification',
    issuer: 'Meta (Facebook) Developer Circle',
    issueDate: '2024-01-20',
    expiryDate: '2025-01-20',
    type: 'Professional Certification',
    status: 'valid',
    verified: true,
    category: 'professional',
    logo: '⚛️',
    color: '#06B6D4',
  },
  // ... (keep the rest of your dummy data)
];

// --- CREDENTIAL CATEGORIES ---
const CREDENTIAL_CATEGORIES = [
  { id: 'all', label: 'All', icon: 'grid-outline' },
  { id: 'education', label: 'Education', icon: 'school-outline' },
  { id: 'professional', label: 'Professional', icon: 'briefcase-outline' },
  { id: 'government', label: 'Government', icon: 'shield-outline' },
  { id: 'health', label: 'Health', icon: 'medical-outline' },
];

// Define the navigation prop type for WalletStack
type WalletScreenNavigationProp = StackNavigationProp<WalletStackParamList, 'WalletMain'>;

type Props = {
  navigation: WalletScreenNavigationProp;
};

export default function WalletScreen({ navigation }: Props) { // Add navigation prop
  const [credentials, setCredentials] = useState(DUMMY_CREDENTIALS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- FILTER CREDENTIALS BY CATEGORY AND SEARCH ---
  const filteredCredentials = credentials.filter((credential) => {
    const matchesCategory = selectedCategory === 'all' || credential.category === selectedCategory;
    const matchesSearch = credential.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          credential.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          credential.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- REFRESH HANDLER ---
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call to refresh credentials
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'Your credentials have been updated.');
    }, 1500);
  };

  // --- CREDENTIAL ITEM COMPONENT ---
  const renderCredentialItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.credentialCard}
      onPress={() => navigation.navigate('CredentialDetail', { credential: item })} // Updated navigation
    >
      {/* ... (keep the rest of your credential card JSX exactly the same) */}
      <View style={styles.credentialHeader}>
        <View style={[styles.credentialLogo, { backgroundColor: `${item.color}20` }]}>
          <Text style={styles.logoText}>{item.logo}</Text>
        </View>
        <View style={styles.credentialInfo}>
          <Text style={styles.credentialTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.credentialIssuer}>{item.issuer}</Text>
          <View style={styles.credentialMeta}>
            <Text style={styles.credentialType}>{item.type}</Text>
            <Text style={styles.credentialDate}>Issued: {item.issueDate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.credentialFooter}>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            item.status === 'valid' && styles.statusValid,
            item.status === 'expiring_soon' && styles.statusWarning,
          ]}>
            <Ionicons
              name={item.verified ? "checkmark-circle" : "alert-circle"}
              size={14}
              color={item.verified ? COLORS.success : COLORS.warning}
            />
            <Text style={styles.statusText}>
              {item.verified ? 'Verified' : 'Pending'}
              {item.expiryDate && ` • Expires: ${item.expiryDate}`}
            </Text>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Share', `Sharing credential: ${item.title}`)}
          >
            <Ionicons name="share-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('CredentialDetail', { credential: item })} // Also here
          >
            <Ionicons name="eye-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // --- CATEGORY FILTER COMPONENT ---
  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons
        name={item.icon}
        size={20}
        color={selectedCategory === item.id ? COLORS.white : COLORS.primary}
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categoryTextActive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER SECTION --- */}
        <View style={styles.header}>
          {/* Top Navigation Row */}
          <View style={styles.topNav}>
            <Text style={styles.appName}>Wallet</Text>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
              {/* Notification Dot */}
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>

          {/* Wallet Stats Card (Floating over header) */}
          <View style={styles.walletStatsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>My Credentials</Text>
              <Text style={styles.statsCount}>{filteredCredentials.length} stored</Text>
            </View>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color={COLORS.textGrey} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search credentials..."
                placeholderTextColor={COLORS.textGrey}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={COLORS.textGrey} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* --- CATEGORY FILTERS --- */}
        <View style={styles.categorySection}>
          <FlatList
            data={CREDENTIAL_CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* --- CREDENTIALS LIST --- */}
        <View style={styles.credentialsSection}>
          <Text style={styles.sectionTitle}>All Credentials</Text>
          
          {filteredCredentials.length > 0 ? (
            <FlatList
              data={filteredCredentials}
              renderItem={renderCredentialItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[COLORS.primary]}
                  tintColor={COLORS.primary}
                />
              }
              ListFooterComponent={<View style={styles.listFooter} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="wallet-outline" size={64} color={COLORS.grey} />
              <Text style={styles.emptyTitle}>No credentials found</Text>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "No credentials match your search"
                  : "You don't have any credentials yet"}
              </Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (keep all your existing styles exactly the same)
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
    paddingTop: 60,
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
  walletStatsCard: {
    backgroundColor: COLORS.white,
    width: '100%',
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  statsCount: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textDark,
  },
  categorySection: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  categoryList: {
    paddingVertical: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  credentialsSection: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  credentialCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  credentialHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  credentialLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 24,
  },
  credentialInfo: {
    flex: 1,
  },
  credentialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  credentialIssuer: {
    fontSize: 14,
    color: COLORS.textGrey,
    marginBottom: 4,
  },
  credentialMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  credentialType: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  credentialDate: {
    fontSize: 12,
    color: COLORS.textGrey,
  },
  credentialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  statusContainer: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusValid: {
    backgroundColor: `${COLORS.success}10`,
  },
  statusWarning: {
    backgroundColor: `${COLORS.warning}10`,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.textGrey,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
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
  listFooter: {
    height: 20,
  },
});