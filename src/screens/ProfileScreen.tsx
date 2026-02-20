// src/screens/ProfileScreen.tsx
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import Card from '../components/Card';

export default function ProfileScreen() {
  const { sessionUserId, profile, initializing } = useAuth();

  if (initializing) return <Text>Chargement du profil…</Text>;
  if (!sessionUserId) return <EmptyView text="Veuillez vous connecter" />;

  const { data: actionsCount, isLoading, error } = useQuery<number>({
    queryKey: ['stats', sessionUserId],
    enabled: !!sessionUserId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('participations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', sessionUserId)
        .eq('status', 'confirmed');

      if (error) {
        console.log('Erreur participations:', error.message);
        throw error;
      }

      return count ?? 0;
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Profil</Text>

      <Card style={styles.card}>
        <Text style={styles.name}>{profile?.display_name || 'Utilisateur'}</Text>
        <Text style={styles.email}>{profile?.email || 'Email non disponible'}</Text>

        {isLoading ? (
          <Text style={styles.stats}>Chargement...</Text>
        ) : error ? (
          <Text style={styles.error}>Erreur de chargement</Text>
        ) : (
          <Text style={styles.stats}>Actions réalisées : {actionsCount ?? 0}</Text>
        )}
      </Card>
    </SafeAreaView>
  );
}

function EmptyView({ text }: { text: string }) {
  return (
    <SafeAreaView style={styles.center}>
      <Text style={styles.info}>{text}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5E9E1', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#8C5B3F', marginBottom: 12 },
  card: { padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  name: { fontSize: 18, fontWeight: '600', color: '#8C5B3F', marginBottom: 4 },
  email: { fontSize: 14, color: '#D9B89E', marginBottom: 8 },
  stats: { fontSize: 16, color: '#8C5B3F' },
  error: { color: 'red' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5E9E1' },
  info: { color: '#8C5B3F' },
});