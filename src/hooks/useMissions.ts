import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { Mission, Participation } from '../types';

const keys = {
  missions: (category?: string, q?: string) => ['missions', category || 'all', q || ''] as const,
  mission: (id: string) => ['mission', id] as const,
  myMissions: (userId: string) => ['myMissions', userId] as const,
};

export function useMissionsList(category?: Mission['category'], q?: string) {
  return useQuery({
    queryKey: keys.missions(category, q),
    queryFn: async () => {
      let query = supabase.from('missions').select('*').order('date', { ascending: true });
      if (category) query = query.eq('category', category);
      if (q) query = query.ilike('title', `%${q}%`);
      const { data, error } = await query;
      if (error) {
        if ((error as any)?.status === 404 || (error as any)?.code === '404') return [] as Mission[];
        throw error;
      }
      return data as Mission[];
    },
  });
}

export function useMission(id?: string) {
  return useQuery({
    queryKey: id ? keys.mission(id) : ['mission'],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('missions').select('*').eq('id', id!).single();
      if (error) {
        if ((error as any)?.status === 404 || (error as any)?.code === '404') return undefined as any;
        throw error;
      }
      const { count } = await supabase
        .from('participations')
        .select('*', { count: 'exact', head: true })
        .eq('mission_id', id!);
      const mission = data as Mission;
      const spots = Math.max(0, mission.capacity - (count || 0));
      return { ...mission, spots_remaining: spots } as Mission;
    },
  });
}

export function useMyMissions(userId?: string) {
  return useQuery({
    queryKey: userId ? keys.myMissions(userId) : ['myMissions'],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participations')
        .select('*, missions(*)')
        .eq('user_id', userId!)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false });
      if (error) {
        if ((error as any)?.status === 404 || (error as any)?.code === '404') return [] as any[];
        throw error;
      }
      return data as (Participation & { missions: Mission })[];
    },
  });
}

export function useParticipate(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mission: Mission) => {
      const payload = { mission_id: mission.id, user_id: userId, status: 'confirmed' as const };
      const { error, data } = await supabase.from('participations').insert(payload).select().single();
      if (error) throw error;
      return data as Participation;
    },
    onMutate: async (mission) => {
      await qc.cancelQueries({ queryKey: keys.mission(mission.id) });
      const prev = qc.getQueryData<Mission>(keys.mission(mission.id));
      if (prev) {
        qc.setQueryData<Mission>(keys.mission(mission.id), {
          ...prev,
          spots_remaining: Math.max(0, prev.spots_remaining - 1),
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

export function useCancelParticipation(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mission: Mission) => {
      const { error } = await supabase
        .from('participations')
        .delete()
        .eq('mission_id', mission.id)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onMutate: async (mission) => {
      await qc.cancelQueries({ queryKey: keys.mission(mission.id) });
      const prev = qc.getQueryData<Mission>(keys.mission(mission.id));
      if (prev) {
        qc.setQueryData<Mission>(keys.mission(mission.id), {
          ...prev,
          spots_remaining: prev.spots_remaining + 1,
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
