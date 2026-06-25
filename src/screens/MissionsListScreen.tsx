//d’afficher toutes les missions disponibles de rechercher une mission de filtrer par catégorie d’ouvrir le détail d’une mission de se déconnecter



import { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMissionsList } from '../hooks/useMissions';
import type { Mission } from '../types';
import { router } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import Card from '../components/Card';
import Button from '../components/Button';
import Chip from '../components/Chip';


// composant affichant UNE mission dans la liste
function MissionItem({ mission }: { mission: Mission }) {
  return (
        // au clic → naviguer vers écran détails mission
    <Pressable onPress={() => router.push(`/mission/${mission.id}`)}>
      <Card style={styles.card}>
        <Text style={styles.title}>{mission.title}</Text>
        <Text style={styles.subtitle}>
          {mission.location} • {new Date(mission.date).toLocaleDateString()}
        </Text>
        <Text style={styles.spots}>
          Places restantes: {mission.spots_remaining}
        </Text>
        <Text style={styles.category}>
          Catégorie: {mission.category}
        </Text>
      </Card>
    </Pressable>
  );
}

// écran principal listant toutes les missions
export default function MissionsListScreen() {
    // catégorie sélectionnée pour filtrer
  const [category, setCategory] = useState<Mission['category'] | undefined>(undefined);
  // texte recherche
  const [q, setQ] = useState('');
  const { data, isLoading, isError, refetch } = useMissionsList(category, q);
  const { sessionUserId, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function handleLogout() {
    setLogoutError(null);
    setSigningOut(true);
    try {
      await signOut();
    } catch (e: any) {
      setLogoutError(e?.message || 'Erreur de déconnexion');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>EcoAction</Text>

        {sessionUserId && (
          <Button variant="secondary" disabled={signingOut} onPress={handleLogout}>
            {signingOut ? 'Déconnexion…' : 'Déconnexion'}
          </Button>
        )}
      </View>

      {/* SEARCH */}
      <TextInput
        style={styles.search}
        placeholder="Rechercher une mission"
        value={q}
        onChangeText={setQ}
        placeholderTextColor="#D9B89E"
      />

      {/* FILTERS */}
     <View style={styles.categories}>
  {(['cleanup', 'planting', 'workshop'] as const).map(c => {
    const selected = category === c;
    return (
      <Pressable
        key={c}
        onPress={() => setCategory(selected ? undefined : c)}
        style={[
          styles.categoryChip,
          selected && styles.categoryChipActive,
        ]}
      >
        <Text
          style={[
            styles.categoryText,
            selected && styles.categoryTextActive,
          ]}
        >
          {c}
        </Text>
      </Pressable>
    );
  })}
</View>

      {/* STATES */}
      {isLoading && <Text style={styles.loading}>Chargement...</Text>}

      {isError && (
        <Button variant="secondary" onPress={() => refetch()}>
          Réessayer
        </Button>
      )}
      {!!logoutError && <Text style={styles.loading}>{logoutError}</Text>}

      {/* LIST */}
      <FlatList
        data={(data || []) as Mission[]}
        keyExtractor={(m: Mission) => m.id}
      renderItem={({ item }: { item: Mission }) => (
  <MissionItem mission={item} />
)}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E9E1',
    padding: 16,
  },
  categories: {
  flexDirection: 'row',
  gap: 10,
  marginBottom: 14,
},

categoryChip: {
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  backgroundColor: '#F2E4EC', // rose très clair
},

categoryChipActive: {
  backgroundColor: '#E38BB7', // rose
},

categoryText: {
  color: '#9B6A88',
  fontWeight: '600',
  textTransform: 'capitalize',
},

categoryTextActive: {
  color: '#fff',
},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8C5B3F',
  },
  search: {
    backgroundColor: 'white',
    borderColor: '#E6D5C0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    color: '#8C5B3F',
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8C5B3F',
  },
  subtitle: {
    fontSize: 14,
    color: '#D9B89E',
    marginTop: 4,
  },
  spots: {
    fontSize: 14,
    color: '#BFA58C',
    marginTop: 4,
  },
  category: {
    fontSize: 14,
    color: '#8C5B3F',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  loading: {
    color: '#8C5B3F',
    textAlign: 'center',
    marginTop: 16,
  },
});
