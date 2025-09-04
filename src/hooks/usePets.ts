import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Pet {
  id: string;
  user_id: string;
  nome: string;
  especie: string;
  raca?: string;
  idade?: number;
  peso?: number;
  sexo?: string;
  cor?: string;
  observacoes?: string;
  foto?: string;
  vacinacao_em_dia: boolean;
  created_at: string;
  updated_at: string;
}

export const usePets = (userId?: string) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchPets();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchPets = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pets:', error);
      } else {
        setPets(data || []);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (petData: Omit<Pet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('pets')
        .insert([{ ...petData, user_id: userId }])
        .select();

      if (error) {
        console.error('Error adding pet:', error);
        return { error };
      } 
      
      if (!data || data.length === 0) {
        return { error: 'No data returned from insert' };
      }

      const newPet = data[0];
      setPets(prev => [newPet, ...prev]);
      return { data: newPet };
    } catch (error) {
      console.error('Error adding pet:', error);
      return { error };
    }
  };

  const updatePet = async (petId: string, updates: Partial<Pet>) => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .update(updates)
        .eq('id', petId)
        .eq('user_id', userId)
        .select();

      if (error) {
        console.error('Error updating pet:', error);
        return { error };
      }
      
      if (!data || data.length === 0) {
        return { error: 'No data returned from update' };
      }

      const updatedPet = data[0];
      setPets(prev => prev.map(pet => pet.id === petId ? updatedPet : pet));
      return { data: updatedPet };
    } catch (error) {
      console.error('Error updating pet:', error);
      return { error };
    }
  };

  const deletePet = async (petId: string) => {
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId)
        .eq('user_id', userId);

      if (error) {
        return { error };
      } else {
        setPets(prev => prev.filter(pet => pet.id !== petId));
        return { success: true };
      }
    } catch (error) {
      return { error };
    }
  };

  return {
    pets,
    loading,
    addPet,
    updatePet,
    deletePet,
    refetchPets: fetchPets
  };
};