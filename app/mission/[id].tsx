import { useLocalSearchParams } from 'expo-router';
import MissionDetailsScreen from '../../src/screens/MissionDetailsScreen';
import { Text, View } from 'react-native';

// Ce fichier représente la page dynamique d’une mission 
export default function Page() {
  // Récupérer l’id depuis l’URL
  const { id } = useLocalSearchParams<{ id?: string }>();

  // Sécurité : si l'id n'existe pas on évite un crash
  if (!id) {
    return (
      <View>
        <Text>Erreur : ID de mission introuvable</Text>
      </View>
    );
  }
  // Afficher l’écran détail mission en lui passant l’id
  return <MissionDetailsScreen id={id} />;
}
