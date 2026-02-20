import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/providers/AuthProvider';
import { Link } from 'expo-router';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      await signUp(email, password);
      setInfo('Compte créé. Vérifiez votre email pour confirmer la connexion.');
    } catch (e: any) {
      setError(e?.message || 'Erreur');
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
          {!!info && <Text style={styles.info}>{info}</Text>}

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
            onPress={handleSignup}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Créer le compte</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <Link href="/login" style={styles.footerLink}>Se connecter</Link>
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
  error: { color: '#dc2626', marginBottom: 10 },
  info: { color: '#16a34a', marginBottom: 10 },
  label: { color: '#8C5B3F', marginBottom: 4, fontWeight: '600' },
  input: { backgroundColor: '#FDF5F0', borderColor: '#E6D5C0', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 16, color: '#8C5B3F' },
  button: { backgroundColor: '#8C5B3F', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  buttonDisabled: { backgroundColor: '#D9B89E' },
  buttonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  footerText: { color: '#8C5B3F', fontSize: 14 },
  footerLink: { color: '#8C5B3F', fontSize: 14, textDecorationLine: 'underline' },
});