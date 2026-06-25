// gérer le cache des données
// Permet de sauvegarder le cache localement avec AsyncStorage (mode offline)

import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';


// Création du client React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 60,
      retry: 1,
    },
  },
});


// stocker le cache dans AsyncStorage
const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
});

persistQueryClient({
  queryClient,
  persister,
});
