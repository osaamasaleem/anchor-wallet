import React from 'react';
    import {
      StyleSheet,
      View,
      Text,
      TouchableOpacity,
      ScrollView,
      StatusBar,
      Platform,
      Image,
    } from 'react-native';
    import { Ionicons } from '@expo/vector-icons';
    // Ensure you have this installed: npx expo install expo-linear-gradient if you want gradients, 
    // but for now we'll stick to solid colors as per your design.

    // --- COLOR PALETTE ---
    const COLORS = {
      primary: '#311F5A', // Deep Purple
      white: '#FFFFFF',
      grey: '#F1F3F6',
      textDark: '#1A202C',
      textGrey: '#718096',
      green: '#22543D',
      greenLight: '#C6F6D5',
      shadow: '#000000',
    };

    export default function HomeScreen() {
      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
          
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* --- HEADER SECTION --- */}
            <View style={styles.header}>
              {/* Top Navigation Row */}
              <View style={styles.topNav}>
                <Text style={styles.appName}>Anchor</Text>
                <TouchableOpacity style={styles.notificationBtn}>
                  <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
                  {/* Notification Dot */}
                  <View style={styles.notificationDot} />
                </TouchableOpacity>
              </View>

              {/* Background Curve/Shape can be simulated with the view's border radius */}
            </View>

            {/* --- IDENTITY CARD (Floating) --- */}
            <View style={styles.identityCard}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                   {/* Placeholder for User Avatar - using an icon for now */}
                   <Ionicons name="person" size={30} color={COLORS.primary} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Usama Saleem</Text>
                  <View style={styles.didContainer}>
                    <Text style={styles.userDid}>did:ethr:0x12...34</Text>
                    <TouchableOpacity>
                        <Ionicons name="copy-outline" size={14} color={COLORS.textGrey} style={{marginLeft: 4}}/>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            </View>

            {/* --- QUICK ACTIONS --- */}
            <View style={styles.actionsContainer}>
              {/* Scan QR Button */}
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.iconCircle, { backgroundColor: '#E0D4FC' }]}> {/* Light Purple bg for icon */}
                    <Ionicons name="qr-code-outline" size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.actionText}>Scan QR</Text>
              </TouchableOpacity>

              {/* Share ID Button */}
              <TouchableOpacity style={styles.actionButton}>
                 <View style={[styles.iconCircle, { backgroundColor: '#E0F2F1' }]}> {/* Light Teal/Blue bg for icon */}
                    <Ionicons name="share-social-outline" size={32} color={COLORS.primary} />
                 </View>
                <Text style={styles.actionText}>Share ID</Text>
              </TouchableOpacity>
            </View>

            {/* --- RECENT CREDENTIALS --- */}
            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Recent Credentials</Text>
              
              {/* Credential Card 1 */}
              <View style={styles.credentialCard}>
                <View style={styles.credLogoPlaceholder}>
                   {/* Placeholder for University Logo */}
                   <Text style={{fontSize: 18}}>🏛️</Text>
                </View>
                <View style={styles.credInfo}>
                  <Text style={styles.credTitle}>Bachelor of Science</Text>
                  <Text style={styles.credIssuer}>Foundation University</Text>
                  <Text style={styles.credDate}>Nov 2025</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="green" />
              </View>

               {/* Credential Card 2 (Example) */}
               <View style={styles.credentialCard}>
                <View style={styles.credLogoPlaceholder}>
                    <Text style={{fontSize: 18}}>🎓</Text>
                </View>
                <View style={styles.credInfo}>
                  <Text style={styles.credTitle}>React Native Certification</Text>
                  <Text style={styles.credIssuer}>Udemy</Text>
                  <Text style={styles.credDate}>Oct 2025</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="green" />
              </View>

            </View>

          </ScrollView>
        </View>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#F8F9FA', // Light grey background
      },
      scrollContent: {
        paddingBottom: 100, // Space for bottom tab bar
      },
      header: {
        backgroundColor: COLORS.primary,
        height: 220,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 20 : 60, // Handle status bar
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
      identityCard: {
        backgroundColor: COLORS.white,
        marginHorizontal: 24,
        marginTop: -60, // Overlap the header
        borderRadius: 16,
        padding: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08, // Softer shadow
        shadowRadius: 12,
        elevation: 5, // Android shadow
      },
      cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.grey,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
      },
      userInfo: {
        flex: 1,
      },
      userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 4,
      },
      didContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      userDid: {
        fontSize: 12,
        color: COLORS.textGrey,
      },
      verifiedBadge: {
        backgroundColor: COLORS.greenLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        position: 'absolute',
        top: 0,
        right: 0,
      },
      verifiedText: {
        color: COLORS.green,
        fontSize: 10,
        fontWeight: 'bold',
      },
      actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginTop: 24,
      },
      actionButton: {
        backgroundColor: COLORS.white,
        width: '47%', // Almost half width
        paddingVertical: 20,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      },
      iconCircle: {
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
      },
      actionText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
      },
      recentSection: {
        paddingHorizontal: 24,
        marginTop: 32,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 16,
      },
      credentialCard: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
      },
      credLogoPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: COLORS.grey,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
      },
      credInfo: {
        flex: 1,
      },
      credTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textDark,
      },
      credIssuer: {
        fontSize: 14,
        color: COLORS.textGrey,
        marginTop: 2,
      },
      credDate: {
          fontSize: 12,
          color: COLORS.textGrey,
          marginTop: 2,
          opacity: 0.7
      }
    });