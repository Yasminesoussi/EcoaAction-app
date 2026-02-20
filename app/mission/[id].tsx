import { useLocalSearchParams } from 'expo-router';
import MissionDetailsScreen from '../../src/screens/MissionDetailsScreen';
import { Text, View } from 'react-native';

export default function Page() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  // ✅ sécurité (évite crash)
  if (!id) {
    return (
      <View>
        <Text>Erreur : ID de mission introuvable</Text>
      </View>
    );
  }

  return <MissionDetailsScreen id={id} />;
}
