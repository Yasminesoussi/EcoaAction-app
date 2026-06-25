// Écran d'inscription utilisateur EcoAction
// Permet de créer un compte avec nom, téléphone, email et mot de passe
// Appelle la fonction signUp du AuthProvider

import { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/providers/AuthProvider';
import { Link } from 'expo-router';

export default function SignupScreen() {
    // récupérer fonction d'inscription depuis AuthProvider
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'error' | 'info' | null>(null);

  useEffect(() => {
    if (!toastVisible || !toastMsg) return;
    const t = setTimeout(() => setToastVisible(false), 4000);
    return () => clearTimeout(t);
  }, [toastVisible, toastMsg]);

   // fonction appelée quand on clique "Créer le compte"
  async function handleSignup() {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    setInfo(null);

     // appel création compte via AuthProvider
    try {
      await signUp(email, password, {
        display_name: name,
        phone: phone,
      });

       // message succès si ok
      const msg = 'Compte créé. Vérifiez votre email.';
      setInfo(msg);
      setToastMsg(msg);
      setToastType('info');
      setToastVisible(true);
    } catch (e: any) {
      const raw = e?.message || 'Erreur';
      const friendly =
        /User already registered/i.test(raw)
          ? 'Utilisateur déjà inscrit. Utilisez “Se connecter”.'
          : raw;
      setError(friendly);
      setToastMsg(friendly);
      setToastType('error');
      setToastVisible(true);
    } finally {
      setLoading(false);
      inFlight.current = false;
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

          <Text style={styles.label}>Nom complet</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nom et prénom"
            placeholderTextColor="#D9B89E"
          />

          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+216 00 000 000"
            placeholderTextColor="#D9B89E"
          />

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
            <Link href="/login" style={styles.footerLink}>
              Se connecter
            </Link>
          </View>
        </View>
      </ScrollView>
      {toastVisible && toastMsg && (
        <View
          style={[
            styles.toast,
            { backgroundColor: toastType === 'error' ? '#ef4444' : '#22c55e' },
          ]}
        >
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5E9E1' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },

  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#8C5B3F' },
  subtitle: { fontSize: 18, color: '#D9B89E', marginTop: 6 },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 26,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  label: { color: '#8C5B3F', marginBottom: 4, fontWeight: '600' },

  input: {
    backgroundColor: '#FDF5F0',
    borderColor: '#E6D5C0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    color: '#8C5B3F',
  },

  button: {
    backgroundColor: '#E38BB7',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },

  buttonDisabled: { backgroundColor: '#D9B89E' },

  buttonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  footerText: { color: '#8C5B3F' },
  footerLink: { color: '#8C5B3F', textDecorationLine: 'underline' },

  error: { color: '#dc2626', marginBottom: 10 },
  info: { color: '#16a34a', marginBottom: 10 },
  toast: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  toastText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
