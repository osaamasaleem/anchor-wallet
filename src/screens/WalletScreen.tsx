// src/screens/WalletScreen.tsx
import React, { useState } from 'react';
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

const DUMMY_CREDENTIALS: Credential[] = [
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
];

const CREDENTIAL_CATEGORIES = [
  { id: 'all', label: 'All', icon: 'grid-outline' },
  { id: 'education', label: 'Education', icon: 'school-outline' },
  { id: 'professional', label: 'Professional', icon: 'briefcase-outline' },
  { id: 'government', label: 'Government', icon: 'shield-outline' },
  { id: 'health', label: 'Health', icon: 'medical-outline' },
];

type WalletScreenNavigationProp = StackNavigationProp<WalletStackParamList, 'WalletMain'>;

type Props = {
  navigation: WalletScreenNavigationProp;
};

export default function WalletScreen({ navigation }: Props) {
  const [credentials, setCredentials] = useState<Credential[]>(DUMMY_CREDENTIALS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCredentials = credentials.filter((credential) => {
    const matchesCategory = selectedCategory === 'all' || credential.category === selectedCategory;
    const matchesSearch = credential.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      credential.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      credential.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'Your credentials have been updated.');
    }, 1500);
  };

  const renderCategoryItem = ({ item }: { item: typeof CREDENTIAL_CATEGORIES[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons
        name={item.icon as any}
        size={scale(20)}
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <AppHeader 
          title="Wallet" 
          hasUnreadNotifications={true}
          onNotificationPress={() => {
            (navigation.getParent() as any)?.navigate('Notifications');
          }}
        />
        
        <FloatingCard offset={-60}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>My Credentials</Text>
            <Text style={styles.statsCount}>{filteredCredentials.length} stored</Text>
          </View>
          
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search credentials..."
          />
        </FloatingCard>

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

        <Section title="All Credentials" showBackground={false} containerStyle={styles.credentialsSection}>
          {filteredCredentials.length > 0 ? (
            <FlatList
              data={filteredCredentials}
              renderItem={({ item }) => (
                <CredentialCard
                  credential={item}
                  variant="detailed"
                  showActions={true}
                  onPress={() => {
                    (navigation.getParent() as any)?.navigate('CredentialDetail', { credential: item });
                  }}
                  onShare={() => Alert.alert('Share', `Sharing credential: ${item.title}`)}
                />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ListFooterComponent={<View style={styles.listFooter} />}
            />
          ) : (
            <LoadingState
              type="empty"
              message={searchQuery ? "No credentials match your search" : "You don't have any credentials yet"}
              icon="wallet-outline"
            />
          )}
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
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statsTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  statsCount: {
    fontSize: fontSize.base,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categorySection: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  categoryList: {
    paddingVertical: spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: spacing.md,
    paddingVertical: scale(10),
    borderRadius: scale(20),
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    marginLeft: scale(6),
    fontSize: fontSize.base,
    fontWeight: '500',
    color: COLORS.primary,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  credentialsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  listFooter: {
    height: spacing.md,
  },
});
