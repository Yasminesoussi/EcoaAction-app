// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

/**
 * Lecture des variables depuis app.config.ts
 * Pour dev rapide, on met aussi un fallback direct.
 */
const extra = Constants.expoConfig?.extra ?? {};

const SUPABASE_URL =
  extra.SUPABASE_URL ?? 'https://ywyogqgzkahxcjayclzi.supabase.co';
const SUPABASE_ANON_KEY =
  extra.SUPABASE_ANON_KEY ??
  'sb_publishable_2GoKRec51kz9xkW8x3yQ_vtXZq-Ro';

// Vérification rapide
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase URL ou ANON_KEY manquant ! Vérifie app.config.ts et rebuild l’app.'
  );
}

console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Key:', SUPABASE_ANON_KEY.substring(0, 8) + '...');

// Création du client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);