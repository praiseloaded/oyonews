// src/components/ClientHeader.tsx
'use client';

import { AuthProvider } from '@/context/AuthContext';
import Header from './Header';

export default function ClientHeader() {
  return (
    <AuthProvider>
      <Header />
    </AuthProvider>
  );
}
