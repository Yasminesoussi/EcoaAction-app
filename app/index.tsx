import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/providers/AuthProvider';

export default function Index() {
  const { sessionUserId, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing) {
      if (sessionUserId) router.replace('/my-missions');
      else router.replace('/login');
    }
  }, [initializing, sessionUserId, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}