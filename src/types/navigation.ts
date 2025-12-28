import { NavigatorScreenParams } from '@react-navigation/native';
import { Credential } from './index';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Mnemonic: undefined;
  MainApp: NavigatorScreenParams<TabParamList>;
  CredentialDetail: { credential: Credential };
  Notifications: undefined;
};

export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  WalletTab: NavigatorScreenParams<WalletStackParamList>;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  QRScanner: undefined;
  CredentialDetail: { credential: Credential };
  Notifications: undefined;
};

export type WalletStackParamList = {
  WalletMain: undefined;
  CredentialDetail: { credential: Credential };
};

