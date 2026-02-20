// src/providers/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface AuthContextProps {
  sessionUserId: string | null;
  profile: any | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Vérifie session Supabase au démarrage
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadProfile(data.session.user.id);
      } else {
        setInitializing(false);
      }
    });

    // Écoute les changements de session
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setSessionUserId(null);
      }
    });

    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  // Charge le profil utilisateur
  const loadProfile = async (userId: string) => {
    console.log('Loading profile for:', userId);

    // 1️⃣ Cherche dans la table profiles (ta table custom)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) console.error('Erreur profiles:', profileError.message);

    if (profileData) {
      setProfile(profileData);
    } else {
      // 2️⃣ Fallback côté client : juste récupérer l’user auth via la session actuelle
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
      if (sessionError) console.error('Erreur getUser:', sessionError.message);

      // Vérifie que c’est bien le même user
      const userFallback = sessionData?.user?.id === userId ? sessionData.user : { email: 'inconnu', id: userId };
      setProfile(userFallback);
    }

    setSessionUserId(userId);
    setInitializing(false);
  };

  // Connexion
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) await loadProfile(data.user.id);
  };

  // Inscription
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      // Crée automatiquement un profil vide dans 'profiles'
      const { error: profileError } = await supabase.from('profiles').insert([{ id: data.user.id, email }]);
      if (profileError) console.error('Erreur création profil:', profileError.message);

      await loadProfile(data.user.id);
    }
  };

  // Déconnexion
  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSessionUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{ sessionUserId, profile, initializing, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);