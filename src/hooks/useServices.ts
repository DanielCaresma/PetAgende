import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Service {
  id: string;
  establishment_id: string;
  nome: string;
  descricao?: string;
  preco: number;
  duracao: number;
  categoria: string;
  especies_atendidas?: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useServices = (establishmentId?: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (establishmentId) {
      fetchServices();
    } else {
      // Fetch all services if no establishment specified
      fetchAllServices();
    }
  }, [establishmentId]);

  const fetchServices = async () => {
    if (!establishmentId) return;
    
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('establishment_id', establishmentId)
        .eq('status', 'ativo')
        .order('categoria', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'ativo')
        .order('categoria', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServicesByPetSpecies = (species: string) => {
    return services.filter(service => {
      if (!service.especies_atendidas) return true;
      return service.especies_atendidas.includes(species);
    });
  };

  return {
    services,
    loading,
    getServicesByPetSpecies,
    refetchServices: establishmentId ? fetchServices : fetchAllServices
  };
};