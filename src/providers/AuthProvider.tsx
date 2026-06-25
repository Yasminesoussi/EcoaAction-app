// Ce fichier gère :
// gère connexion Supabase
// garde utilisateur connecté
// charge profil
// permet login / signup / logout
// partage auth dans toute l’app

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { router } from "expo-router";

export interface UserProfile {
  id: string;
  email?: string;
  display_name?: string;
  phone?: string;
}
// type du contexte Auth
interface AuthContextProps {
  sessionUserId: string | null;  // id utilisateur connecté
  profile: UserProfile | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>; // connexion
  signUp: (
    email: string,
    password: string,
    meta?: { display_name?: string; phone?: string }
  ) => Promise<void>; // inscription
  signOut: () => Promise<void>;  // déconnexion
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);
 


  // au démarrage app → vérifier session Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadProfile(data.session.user.id);
      } else {
        setInitializing(false);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setSessionUserId(null);
        setInitializing(false);
      }
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);


  // fonction charger profil utilisateur
  const loadProfile = async (userId: string) => {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id,email,display_name,phone")
      .eq("id", userId)
      .maybeSingle();
    if (profileData) {
      setProfile(profileData);
    } else {
      const { data: userData } = await supabase.auth.getUser();
      const u = userData.user;
      if (u) {
        setProfile({
          id: u.id,
          email: u.email,
          display_name: u.user_metadata?.display_name,
          phone: u.user_metadata?.phone,
        });
      }
    }
    setSessionUserId(userId);
    setInitializing(false);
  };


  // fonction connexion
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      await loadProfile(data.user.id);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    meta?: { display_name?: string; phone?: string }
  ) => {
    console.log("Auth.signUp:start", {
      email,
      meta_present: !!meta,
      display_name_len: (meta?.display_name || "").length,
      phone_len: (meta?.phone || "").length,
    });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: meta?.display_name || "",
          phone: meta?.phone || "",
        },
      },
    });
    console.log("Auth.signUp:response", {
      user_present: !!data?.user,
      error_present: !!error,
      error_status: (error as any)?.status,
      error_message: error?.message,
      error_name: (error as any)?.name,
    });
    if (error) {
      throw error;
    }
    await supabase.auth.signOut();
    setProfile(null);
    setSessionUserId(null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSessionUserId(null);
  };


    // fournir auth à toute l'app
  return (
    <AuthContext.Provider
      value={{
        sessionUserId,
        profile,
        initializing,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
