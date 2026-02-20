import type { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'EcoAction',
  slug: 'ecoaction',
  scheme: 'ecoaction',
  extra: {
    SUPABASE_URL: 'https://ywyogqgzkahxcjayclzi.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_2GoKRec51kz9xkWgW8x3yQ_vtXZq-Ro',
  },
  plugins: ['expo-router'],
};

export default config;
