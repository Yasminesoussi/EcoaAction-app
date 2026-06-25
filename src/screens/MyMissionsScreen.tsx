// Affiche la liste des missions de l'utilisateur connecté
// Permet de consulter les détails d'une mission ou réessayer en cas d'erreur


import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthProvider';
import { useMyMissions } from '../hooks/useMissions';
import Card from '../components/Card';
import { router } from 'expo-router';

export default function MyMissionsScreen() {

    // Récupérer l'utilisateur connecté
  const { sessionUserId } = useAuth();

    // Appel du hook pour récupérer les missions
  const { data, isLoading, isError, refetch } = useMyMissions(
    sessionUserId ?? undefined
  );


  // Si pas connecté
  if (!sessionUserId) return <EmptyView text="Veuillez vous connecter" />;
  if (isLoading) return <EmptyView text="Chargement..." />;
  if (isError)
    return <EmptyView text="Erreur de chargement" onRetry={() => refetch()} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>   Mes missions</Text>


{/* Liste des missions */}
      <FlatList
        data={data || []}
        keyExtractor={(item: { id: string }) => item.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({
          item,
        }: {
          item: {
            id: string;
            missions: {
              id: string;
              title: string;
              date: string;
              localisation?: string;
              category?: string;
            };
          };
        }) => (

             // Navigation vers le détail de la mission
          <Pressable
            onPress={() => router.push(`/mission/${item.missions.id}`)}
            style={({ pressed }) => [
              styles.pressable,
              pressed && styles.cardPressed,
            ]}
          >
            <Card style={styles.card}>
              <View style={styles.rowTop}>
                 {/* Titre mission */}
                <Text style={styles.title}>{item.missions.title}</Text>
                {item.missions.category && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {item.missions.category}
                    </Text>
                  </View>
                )}
              </View>

             {/* Date */}
              <Text style={styles.date}>
                📅 {new Date(item.missions.date).toLocaleDateString()}
              </Text>


             {/* Localisation */}
              {item.missions.localisation && (
                <Text style={styles.location}>
                  📍 {item.missions.localisation}
                </Text>
              )}
            </Card>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}


// Composant pour afficher messages (vide, erreur, chargement)
function EmptyView({ text, onRetry }: { text: string; onRetry?: () => void }) {
  return (
    <SafeAreaView style={styles.center}>
      <Text style={styles.info}>{text}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} style={styles.retryBtn}>
          <Text style={styles.retryText}>Réessayer</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7F4',
    paddingHorizontal: 18,
  },
  header: {
    fontSize: 30,
    fontWeight: '800',
    color: '#14532D',
    marginBottom: 18,
    marginTop: 6,
  },
  pressable: {
    marginBottom: 16,
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  card: {
    padding: 20,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    shadowColor: '#14532D',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#064E3B',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  date: {
    fontSize: 14,
    color: '#065F46',
    marginTop: 8,
    fontWeight: '500',
  },
  location: {
    fontSize: 13,
    color: '#047857',
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F7F4',
    padding: 24,
  },
  info: {
    color: '#065F46',
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#16A34A',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
});