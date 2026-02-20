import { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMissionsList } from '../hooks/useMissions';
import type { Mission } from '../types';
import { Link, router } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import Card from '../components/Card';
import Button from '../components/Button';
import Chip from '../components/Chip';

function MissionItem({ mission }: { mission: Mission }) {
  return (
    <Pressable onPress={() => router.push(`/mission/${mission.id}`)}>
      <Card style={styles.card}>
        <Text style={styles.title}>{mission.title}</Text>
        <Text style={styles.subtitle}>{mission.location} • {new Date(mission.date).toLocaleDateString()}</Text>
        <Text style={styles.spots}>Places restantes: {mission.spots_remaining}</Text>
        <Text style={styles.category}>Catégorie: {mission.category}</Text>
      </Card>
    </Pressable>
  );
}

export default function MissionsListScreen() {
  const [category, setCategory] = useState<Mission['category'] | undefined>(undefined);
  const [q, setQ] = useState('');
  const { data, isLoading, isError, refetch } = useMissionsList(category, q);
  const { sessionUserId, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>EcoAction</Text>
        {sessionUserId ? (
          <Button variant="secondary" onPress={signOut}>
            Déconnexion
          </Button>
        ) : (
          <Link href="/login" style={styles.link}>Connexion</Link>
        )}
      </View>

      <TextInput
        style={styles.search}
        placeholder="Rechercher une mission"
        value={q}
        onChangeText={setQ}
        placeholderTextColor="#D9B89E"
      />

      <View style={styles.chips}>
        {(['cleanup', 'planting', 'workshop'] as const).map(c => (
          <Chip
            key={c}
            label={c}
            selected={category === c}
            onPress={() => setCategory(category === c ? undefined : c)}
          />
        ))}
      </View>

      {isLoading && <Text style={styles.loading}>Chargement...</Text>}
      {isError && (
        <Button variant="secondary" onPress={() => refetch()}>
          Réessayer
        </Button>
      )}

      <FlatList
        data={(data || []) as Mission[]}
        keyExtractor={(m: Mission) => m.id}
        renderItem={({ item }: { item: Mission }) => <MissionItem mission={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      <View style={styles.footer}>
        <Link href="/my-missions" style={styles.link}>Mes Missions</Link>
        <Link href="/profile" style={styles.link}>Profil</Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5E9E1', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  appTitle: { fontSize: 24, fontWeight: 'bold', color: '#8C5B3F' },
  link: { color: '#8C5B3F', fontSize: 16 },
  search: { backgroundColor: 'white', borderColor: '#E6D5C0', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12, color: '#8C5B3F' },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  card: { marginBottom: 12, padding: 16, borderRadius: 20, backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#8C5B3F' },
  subtitle: { fontSize: 14, color: '#D9B89E', marginTop: 4 },
  spots: { fontSize: 14, color: '#BFA58C', marginTop: 4 },
  category: { fontSize: 14, color: '#8C5B3F', marginTop: 2, textTransform: 'capitalize' },
  loading: { color: '#8C5B3F', textAlign: 'center', marginTop: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
});
