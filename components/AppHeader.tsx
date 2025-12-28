import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../constants/colors';
import { scale } from '../utils/responsive';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
  hasUnreadNotifications?: boolean;
  rightComponent?: React.ReactNode;
  headerHeight?: number;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  showNotifications = true,
  hasUnreadNotifications = false,
  rightComponent,
  headerHeight = 220,
  onBackPress,
  onNotificationPress,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      (navigation as any).navigate('Notifications');
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={[styles.header, { height: scale(headerHeight) }]}>
        <View style={styles.topNav}>
          {showBackButton ? (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackPress}
            >
              <Ionicons name="arrow-back" size={scale(24)} color={COLORS.white} />
            </TouchableOpacity>
          ) : (
            <Text style={styles.appName}>{title}</Text>
          )}
          
          {!showBackButton && <View style={styles.placeholder} />}
          
          {rightComponent || (
            showNotifications && (
              <TouchableOpacity 
                style={styles.notificationBtn}
                onPress={handleNotificationPress}
              >
                <Ionicons name="notifications-outline" size={scale(24)} color={COLORS.white} />
                {hasUnreadNotifications && <View style={styles.notificationDot} />}
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: scale(24),
    borderBottomRightRadius: scale(24),
    paddingHorizontal: scale(24),
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + scale(20) : scale(60),
    alignItems: 'flex-start',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  appName: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: COLORS.white,
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBtn: {
    position: 'relative',
    padding: scale(4),
  },
  notificationDot: {
    position: 'absolute',
    top: scale(4),
    right: scale(4),
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  placeholder: {
    width: scale(40),
  },
});

