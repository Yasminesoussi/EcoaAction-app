import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMission, useParticipate, useCancelParticipation } from '../hooks/useMissions';
import { useAuth } from '../providers/AuthProvider';
import Card from '../components/Card';
import Button from '../components/Button';

export default function MissionDetailsScreen({ id }: { id: string }) {
  // récupérer l’id de l’utilisateur connecté
  const { sessionUserId } = useAuth();
  const userId = sessionUserId ?? undefined;

   // récupérer les données de la mission (appel API via hook)
  const { data, isLoading, isError, refetch } = useMission(
    id,
    userId as string // TS safe car écran protégé auth
  );

    //participer à la mission
  const participate = useParticipate(userId as string);
  // annuler participation
  const cancel = useCancelParticipation(userId as string);

    // état chargement → afficher vue loading
  if (isLoading) return <LoadingView text="Chargement..." />;
  if (isError || !data) return <ErrorView onRetry={refetch} />;

  const mission = data;
  // si l’utilisateur participe déjà
  const isParticipating = mission.user_participating;
  const isFull = mission.spots_remaining <= 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Card style={styles.card}>
              {/* carte contenant les infos mission */}
          <Text style={styles.title}>{mission.title}</Text>

          <Text style={styles.meta}>
            {mission.location} • {new Date(mission.date).toLocaleDateString()}
          </Text>

          <Text style={styles.description}>{mission.description}</Text>

          <Text style={styles.spotsText}>
            {mission.spots_remaining} / {mission.capacity} places
          </Text>

          {isParticipating && (
            <Text style={styles.participating}>
              ✓ Vous participez
            </Text>
          )}
        </Card>

        {/* afficher actions seulement si connecté */}
        {userId && (
          <View style={styles.actions}>
            {isParticipating ? (
              <Button
                variant="secondary"
                onPress={() => cancel.mutate(mission)}
                disabled={cancel.isPending}
              >
                Annuler participation
              </Button>
            ) : (
              <Button
                style={styles.primaryBtn}
                onPress={() => participate.mutate(mission)}
                disabled={isFull || participate.isPending}
              >
                {isFull ? 'Complet' : 'Participer'}
              </Button>
            )}
          </View>
        )}
      </View>
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
  container: {
    flex: 1,
    backgroundColor: '#F5E9E1',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    borderRadius: 26,
    padding: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#7C4A63',
    marginBottom: 10,
    textAlign: 'center',
  },

  meta: {
    fontSize: 14,
    color: '#B07A9A',
    textAlign: 'center',
    marginBottom: 14,
  },

  description: {
    fontSize: 16,
    color: '#6B4B5A',
    textAlign: 'center',
    marginBottom: 16,
  },

  spotsText: {
    color: '#9B6A88',
    fontWeight: '600',
    textAlign: 'center',
  },

  participating: {
    textAlign: 'center',
    color: '#22c55e',
    marginTop: 10,
    fontWeight: '600',
  },

  actions: {
    marginTop: 20,
    gap: 10,
  },

  primaryBtn: {
    backgroundColor: '#E38BB7',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E9E1',
  },

  loadingText: {
    color: '#8C5B3F',
  },
});
