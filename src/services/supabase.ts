//configure la connexion avec Supabase
// Permet d'accéder à la base de données et aux services backend


import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

/**
 * Lecture des variables depuis app.config.ts
 * Pour dev rapide, on met aussi un fallback direct.
 */
const extra = Constants.expoConfig?.extra ?? {};

const SUPABASE_URL = extra.SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = extra.SUPABASE_ANON_KEY as string | undefined;

// Vérification rapide
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase URL ou ANON_KEY manquant ! Vérifie app.config.ts et rebuild l’app.'
  );
}

// Création du client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
