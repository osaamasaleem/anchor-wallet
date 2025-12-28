// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
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

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeMain'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const handleShareID = () => {
    const userDID = "did:ethr:0x12...34";
    Share.share({
      message: `Connect with me on Anchor Wallet! My Decentralized Identity: ${userDID}`,
      title: 'Share my Digital Identity',
    })
      .then((result) => {
        if (result.action === Share.sharedAction) {
          Alert.alert('Shared successfully!');
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to share: ' + error.message);
      });
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
    },
    {
      id: '2',
      title: 'React Native Certification',
      issuer: 'Udemy',
      issueDate: '2023-10-01',
      expiryDate: '2025-10-01',
      type: 'Professional Certification',
      status: 'valid' as const,
      verified: true,
      category: 'professional' as const,
      logo: '🎓',
      color: '#06B6D4',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
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
              <Ionicons name="person" size={scale(30)} color={COLORS.primary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Usama Saleem</Text>
              <View style={styles.didContainer}>
                <Text style={styles.userDid}>did:ethr:0x12...34</Text>
                <TouchableOpacity>
                  <Ionicons name="copy-outline" size={scale(14)} color={COLORS.textGrey} style={{ marginLeft: spacing.xs }} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified</Text>
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
            onPress={handleShareID}
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
  verifiedBadge: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: scale(12),
    position: 'absolute',
    top: 0,
    right: 0,
  },
  verifiedText: {
    color: COLORS.success,
    fontSize: fontSize.xs,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  actionButton: {
    backgroundColor: COLORS.white,
    width: '47%',
    paddingVertical: spacing.md,
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: scale(8),
    elevation: 2,
  },
  iconCircle: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  recentSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
});
