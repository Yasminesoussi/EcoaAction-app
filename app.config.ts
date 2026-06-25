import type { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'EcoAction',
  slug: 'ecoaction',
  scheme: 'ecoaction',
  extra: {
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
  plugins: ['expo-router'],
};

export default config;
