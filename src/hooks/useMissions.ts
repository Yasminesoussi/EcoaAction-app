// Ce fichier contient toutes les fonctions pour :
// - récupérer missions
// - récupérer détail mission
// - récupérer mes missions
// - participer à une mission
// - annuler participation

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { Mission, Participation } from '../types';

const keys = {
  missions: (category?: string, q?: string) =>
    ['missions', category || 'all', q || ''] as const,  // liste missions filtrée
  mission: (id: string) => ['mission', id] as const, // détail mission
  myMissions: (userId: string) => ['myMissions', userId] as const,  // missions utilisateur
};



// LISTE MISSIONS
export function useMissionsList(category?: Mission['category'], q?: string) {
  return useQuery({
    queryKey: keys.missions(category, q),
     // fonction qui récupère missions depuis Supabase
    queryFn: async () => {
      let query = supabase  
        .from('missions') // table missions
        .select('*')
        .order('date', { ascending: true });  // tri par date

              // filtre catégorie si fourni
      if (category) query = query.eq('category', category);

      // recherche texte dans titre
      if (q) query = query.ilike('title', `%${q}%`);

      const { data, error } = await query;
      if (error) throw error;

      return data as Mission[];
    },
  });
}

// DETAIL MISSION
export function useMission(id?: string, userId?: string) {
  return useQuery({
    queryKey: ['mission', id, userId],
    enabled: !!id,
    queryFn: async () => {
     // récupérer mission
      const { data: missionData, error } = await supabase
        .from('missions')
        .select('*')
        .eq('id', id!)
        .single();

      if (error) throw error;

      const mission = missionData as Mission;

      // compter participants
      const { count } = await supabase
        .from('participations')
        .select('*', { count: 'exact', head: true })
        .eq('mission_id', id!);

        // calcul places restantes
      const spots = Math.max(0, mission.capacity - (count || 0));

      // vérifier si utilisateur participe
      let isParticipating = false;

      if (userId) {
        const { data: p } = await supabase
          .from('participations')
          .select('id')
          .eq('mission_id', id!)
          .eq('user_id', userId)
          .maybeSingle();

        isParticipating = !!p;
      }


      // retourner mission + infos calculées
      return {
        ...mission,
        spots_remaining: spots,
        user_participating: isParticipating,
      };
    },
  });
}


// MES MISSIONS UTILISATEUR
export function useMyMissions(userId?: string) {
  return useQuery({
    queryKey: userId ? keys.myMissions(userId) : ['myMissions'],
    enabled: !!userId,  // seulement si connecté
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participations')
        .select('*, missions(*)')
        .eq('user_id', userId!)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as (Participation & { missions: Mission })[];
    },
  });
}


// PARTICIPER A UNE MISSION
export function useParticipate(userId: string) {
  const qc = useQueryClient();

  return useMutation({
    // fonction qui inscrit utilisateur
    mutationFn: async (mission: Mission) => {
     // vérifier déjà inscrit 
     const { data: existing } = await supabase
  .from('participations')
  .select('id')
  .eq('mission_id', mission.id)
  .eq('user_id', userId)
  .maybeSingle();

if (existing) throw new Error('Déjà inscrit');

      const payload = {
        mission_id: mission.id,
        user_id: userId,
        status: 'confirmed' as const,
      };

      const { error, data } = await supabase
        .from('participations')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      return data as Participation;
    },

    onMutate: async (mission) => {
      await qc.cancelQueries({ queryKey: keys.mission(mission.id) });

      const prev = qc.getQueryData<any>(keys.mission(mission.id));

      if (prev) {
        qc.setQueryData(keys.mission(mission.id), {
          ...prev,
          spots_remaining: Math.max(0, prev.spots_remaining - 1),
          user_participating: true,
        });
      }

      return { prev };
    },

    onError: (_err, mission, ctx) => {
      if (ctx?.prev) qc.setQueryData(keys.mission(mission.id), ctx.prev);
    },

    onSettled: (_data, _err, mission) => {
      qc.invalidateQueries({ queryKey: keys.mission(mission.id) });
      qc.invalidateQueries({ queryKey: keys.myMissions(userId) });
    },
  });
}


// ANNULER PARTICIPATION
export function useCancelParticipation(userId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (mission: Mission) => {
       // vérifier participation existe
      const { data: existing } = await supabase
        .from('participations')
        .select('id')
        .eq('mission_id', mission.id)
        .eq('user_id', userId)
        .maybeSingle();

      if (!existing) {
        throw new Error('Pas inscrit');
      }

      const { error } = await supabase
        .from('participations')
        .delete()
        .eq('mission_id', mission.id)
        .eq('user_id', userId);

      if (error) throw error;
    },

    onMutate: async (mission) => {
      await qc.cancelQueries({ queryKey: keys.mission(mission.id) });

      const prev = qc.getQueryData<any>(keys.mission(mission.id));

      if (prev) {
        qc.setQueryData(keys.mission(mission.id), {
          ...prev,
          spots_remaining: prev.spots_remaining + 1,
          user_participating: false,
        });
      }

      return { prev };
    },

    onError: (_err, mission, ctx) => {
      if (ctx?.prev) qc.setQueryData(keys.mission(mission.id), ctx.prev);
    },

    onSettled: (_data, _err, mission) => {
      qc.invalidateQueries({ queryKey: keys.mission(mission.id) });
      qc.invalidateQueries({ queryKey: keys.myMissions(userId) });
    },
  });
}