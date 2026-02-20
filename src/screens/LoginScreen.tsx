import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthProvider';
import { Link, router } from 'expo-router'; // ← pour naviguer

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);

      // ✅ Navigation après connexion réussie
      router.push('/index'); // ← ici tu mets la route de ta liste de missions
    } catch (e: any) {
      setError(e.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>EcoAction</Text>
          <Text style={styles.subtitle}>Agissez pour l’environnement</Text>
        </View>
        <View style={styles.card}>
          {!!error && <Text style={styles.error}>{error}</Text>}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#D9B89E"
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#D9B89E"
          />

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
            onPress={handleSignIn}
          >
            <Text style={styles.buttonText}>{loading ? 'Connexion…' : 'Se connecter'}</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas de compte ? </Text>
            <Link href="/signup" style={styles.footerLink}>Créer un compte</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5E9E1' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#8C5B3F' },
  subtitle: { fontSize: 18, color: '#D9B89E', marginTop: 6, textAlign: 'center' },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  error: { color: 'red', marginBottom: 10 },
  label: { color: '#8C5B3F', marginBottom: 4, fontWeight: '600' },
  input: { backgroundColor: '#FDF5F0', borderColor: '#E6D5C0', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12, color: '#8C5B3F' },
  button: { backgroundColor: '#8C5B3F', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  buttonDisabled: { backgroundColor: '#D9B89E' },
  buttonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  footerText: { color: '#8C5B3F', fontSize: 14 },
  footerLink: { color: '#8C5B3F', fontSize: 14, textDecorationLine: 'underline' },
});
