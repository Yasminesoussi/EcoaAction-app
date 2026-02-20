// app/_layout.tsx
import { Slot } from 'expo-router';
import { StatusBar } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/services/queryClient';
import { AuthProvider } from '../src/providers/AuthProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          {/* Toujours rendre le Slot dès le départ */}
          <Slot />
          <StatusBar barStyle="light-content" />
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}