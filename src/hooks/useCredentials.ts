import { useState } from 'react';
import { Credential } from '../types';

export const useCredentials = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);

  // Add credential
  const addCredential = (credential: Credential) => {
    setCredentials(prev => [...prev, credential]);
  };

  // Remove credential
  const removeCredential = (id: string) => {
    setCredentials(prev => prev.filter(c => c.id !== id));
  };

  // Update credential
  const updateCredential = (id: string, updates: Partial<Credential>) => {
    setCredentials(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  // Filter credentials by category
  const filterByCategory = (category: string) => {
    return category === 'all'
      ? credentials
      : credentials.filter(c => c.category === category);
  };

  // Search credentials
  const searchCredentials = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return credentials.filter(
      c =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.issuer.toLowerCase().includes(lowerQuery) ||
        c.type.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    credentials,
    loading,
    setCredentials,
    addCredential,
    removeCredential,
    updateCredential,
    filterByCategory,
    searchCredentials,
  };
};

