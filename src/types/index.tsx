// src/types/index.tsx
export type Credential = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  type: string;
  status: 'valid' | 'expiring_soon' | 'expired';
  verified: boolean;
  category: 'education' | 'professional' | 'government' | 'health';
  logo: string;
  color: string;
};

export type User = {
  name: string;
  email: string;
  did: string;
  joinDate: string;
};

export type NavigationParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Mnemonic: undefined;
  MainApp: undefined;
};