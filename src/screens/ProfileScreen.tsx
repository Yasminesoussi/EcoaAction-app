// Affiche les informations du profil utilisateur connecté
// Montre aussi le nombre d’actions réalisées (missions confirmées)


import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ProfileScreen() 
{

    // Récupération des infos utilisateur
  const { sessionUserId, profile, initializing } = useAuth();

  const userId = sessionUserId ?? undefined;


  // Requête pour compter les actions confirmées
  const {
    data: actionsCount = 0,
    refetch,
  } = useQuery<number>({
    queryKey: ['stats', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return 0;


         // Requête Supabase
      const { count } = await supabase
        .from('participations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'confirmed');

      return count ?? 0;
    },
  });


    // Rafraîchir les données 
  useFocusEffect(
    useCallback(() => {
      if (userId) refetch();
    }, [userId])
  );

  if (initializing) return null;
    // Pas connecté
  if (!userId) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.display_name?.charAt(0) || 'U'}
          </Text>
        </View>

        <Text style={styles.name}>
          {profile?.display_name || 'Utilisateur'}
        </Text>

        <Text style={styles.email}>
          {profile?.email || ''}
        </Text>

        {profile?.phone && (
          <Text style={styles.phone}>
            {profile.phone}
          </Text>
        )}

        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>
            {actionsCount}
          </Text>
          <Text style={styles.statsLabel}>
            Actions réalisées
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E9E1',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E38BB7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  avatarText: {
    color: '#fff',
    fontSize: 34,
    fontWeight: 'bold',
  },

  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7C4A63',
  },

  email: {
    fontSize: 15,
    color: '#B07A9A',
    marginTop: 4,
  },

  phone: {
    fontSize: 15,
    color: '#B07A9A',
    marginTop: 2,
  },

  statsCard: {
    marginTop: 26,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    alignItems: 'center',
  },

  statsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E38BB7',
  },

  statsLabel: {
    fontSize: 14,
    color: '#9B6A88',
    marginTop: 4,
  },
});