// Ce fichier gère la navigation principale de l’app
// + la gestion connexion utilisateur
// + la barre d’onglets en bas

import { Tabs, Redirect, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "../src/providers/AuthProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/services/queryClient";
import { View, StyleSheet } from "react-native";


// Il active React Query et le contexte Auth
export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Layout principal
function RootLayout() {

   // récupérer utilisateur connecté
  const { sessionUserId, initializing } = useAuth();
  const segments = useSegments();

  if (initializing) return null;

  const inAuthScreen =
    segments[0] === "login" || segments[0] === "signup";


  // pas connecté → redirige login
  if (!sessionUserId && !inAuthScreen) {
    return <Redirect href="/login" />;
  }

  // connecté → empêche accès login/signup
  if (sessionUserId && inAuthScreen) {
    return <Redirect href="/" />;
  }


   // Navigation par onglets en bas
  return (
 <Tabs
  screenOptions={{
    headerShown: false,
    tabBarShowLabel: false,


    // cacher tab bar dans login/signup
    tabBarStyle: inAuthScreen
      ? { display: "none" }
      : styles.tabBar,

    tabBarItemStyle: styles.tabItem,   
    tabBarIconStyle: styles.tabIcon,   
  }}
>
     {/* Accueil */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="home" focused={focused} />
          ),
        }}
      />

 {/* Mes missions */}
      <Tabs.Screen
        name="my-missions"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="list" focused={focused} />
          ),
        }}
      />

   {/* Profil */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="person" focused={focused} />
          ),
        }}
      />

      {/* écrans cachés de la tab bar */}
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="signup" options={{ href: null }} />
      <Tabs.Screen name="mission/[id]" options={{ href: null }} />
    </Tabs>
  );
}

// Composant icône onglet
function Icon({ name, focused }: { name: any; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconActive]}>
      <Ionicons
        name={focused ? name : `${name}-outline`}
        size={22}
        color={focused ? "#fff" : "#B07A9A"} // gris-rose
      />
    </View>
  );
}

const styles = StyleSheet.create({
 tabBar: {
  position: "absolute",
  bottom: 18,
  left: 18,
  right: 18,
  height: 70,
  borderRadius: 35,
  backgroundColor: "#F6EAF2", // rose très clair
  borderTopWidth: 0,
  elevation: 8,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 12,
},
tabItem: {
  height: 70,
  justifyContent: "center",
  alignItems: "center",
},

tabIcon: {
  marginTop: 0,
  marginBottom: 0,
},
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrap: {
  width: 46,
  height: 46,
  borderRadius: 23,
  justifyContent: "center",
  alignItems: "center",
},

iconActive: {
  backgroundColor: "#E38BB7", // rose actif
},
  active: {
    backgroundColor: "#22c55e",
  },
});