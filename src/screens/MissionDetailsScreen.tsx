import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useMission, useParticipate, useCancelParticipation } from '../hooks/useMissions';
import { useAuth } from '../providers/AuthProvider';
import Card from '../components/Card';
import Button from '../components/Button';

export default function MissionDetailsScreen({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } = useMission(id);
  const { sessionUserId } = useAuth();
  const participate = useParticipate(sessionUserId || '');
  const cancel = useCancelParticipation(sessionUserId || '');

  if (isLoading) return <LoadingView text="Chargement..." />;
  if (isError || !data) return <ErrorView onRetry={() => refetch()} />;

  const mission = data;

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{mission.title}</Text>
        <Text style={styles.location}>{mission.location}</Text>
        <Text style={styles.date}>{new Date(mission.date).toLocaleString()}</Text>
        <Text style={styles.description}>{mission.description}</Text>
        <Text style={styles.spots}>
          Places restantes: {mission.spots_remaining} / {mission.capacity}
        </Text>
      </Card>

      {sessionUserId ? (
        <View>
          <Button
            style={styles.button}
            onPress={() => participate.mutate(mission)}
            disabled={mission.spots_remaining <= 0 || participate.isPending}
          >
            {participate.isPending
              ? 'Inscription...'
              : mission.spots_remaining <= 0
              ? 'Complet'
              : "S'inscrire"}
          </Button>

          <Button
            variant="secondary"
            onPress={() => cancel.mutate(mission)}
            disabled={cancel.isPending}
          >
            {cancel.isPending ? 'Annulation...' : 'Annuler ma participation'}
          </Button>

          {(participate.isError || cancel.isError) && (
            <Text style={styles.error}>Une erreur est survenue</Text>
          )}
        </View>
      ) : (
        <Text style={styles.loginPrompt}>Connectez-vous pour participer.</Text>
      )}
    </SafeAreaView>
  );
}

function LoadingView({ text }: { text: string }) {
  return (
    <SafeAreaView style={styles.loadingContainer}>
      <Text style={styles.loadingText}>{text}</Text>
    </SafeAreaView>
  );
}

function ErrorView({ onRetry }: { onRetry: () => void }) {
  return (
    <SafeAreaView style={styles.loadingContainer}>
      <Button variant="secondary" onPress={onRetry}>
        Réessayer
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5E9E1', padding: 16 },
  card: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#8C5B3F', marginBottom: 4 },
  location: { fontSize: 16, color: '#8C5B3F', marginBottom: 2 },
  date: { fontSize: 14, color: '#D9B89E', marginBottom: 8 },
  description: { fontSize: 16, color: '#8C5B3F', marginBottom: 8 },
  spots: { fontSize: 14, color: '#BFA58C', fontWeight: '500' },
  button: { marginBottom: 12 },
  error: { color: 'red', marginTop: 8 },
  loginPrompt: { color: '#8C5B3F', textAlign: 'center', marginTop: 12 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5E9E1' },
  loadingText: { color: '#8C5B3F' },
});
