import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthProvider';
import { useMyMissions } from '../hooks/useMissions';
import Card from '../components/Card';
import Button from '../components/Button';

export default function MyMissionsScreen() {
  const { sessionUserId } = useAuth();

  // Si sessionUserId est null, on passe undefined à useMyMissions
  const { data, isLoading, isError, refetch } = useMyMissions(sessionUserId ?? undefined);

  // Cas où l'utilisateur n'est pas connecté
  if (!sessionUserId) return <EmptyView text="Veuillez vous connecter" />;

  // Cas de chargement
  if (isLoading) return <EmptyView text="Chargement..." />;

  // Cas d'erreur
  if (isError) return <EmptyView text="Erreur. Réessayer" onRetry={() => refetch()} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Mes Missions</Text>
      <FlatList
        data={data || []}
        keyExtractor={(p: { id: string }) => p.id}
        renderItem={({
          item,
        }: {
          item: { id: string; missions: { title: string; date: string } };
        }) => (
          <Card style={styles.card}>
            <Text style={styles.title}>{item.missions.title}</Text>
            <Text style={styles.date}>
              {new Date(item.missions.date).toLocaleString()}
            </Text>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

// Composant pour affichage vide / info / erreur
function EmptyView({ text, onRetry }: { text: string; onRetry?: () => void }) {
  return (
    <SafeAreaView style={styles.center}>
      <Text style={styles.info}>{text}</Text>
      {onRetry && (
        <Text style={styles.link} onPress={onRetry}>
          Réessayer
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5E9E1', padding: 16 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8C5B3F',
    marginBottom: 12,
  },
  card: {
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  title: { fontSize: 18, fontWeight: '600', color: '#8C5B3F' },
  date: { fontSize: 14, color: '#D9B89E', marginTop: 4 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E9E1',
  },
  info: { color: '#8C5B3F', marginBottom: 4 },
  link: { color: '#8C5B3F', textDecorationLine: 'underline', marginTop: 4 },
});