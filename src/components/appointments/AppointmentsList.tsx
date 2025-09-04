import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";

interface Appointment {
  id: string;
  data_agendamento: string;
  horario_inicio: string;
  horario_fim: string;
  preco_final: number;
  status: string;
  observacoes?: string;
  services: {
    nome: string;
    descricao?: string;
  };
  pets: {
    nome: string;
    especie: string;
    foto?: string;
  };
  establishments: {
    nome: string;
    endereco?: any;
  };
}

interface AppointmentsListProps {
  onNavigate: (page: string) => void;
  onReview: () => void;
}

export const AppointmentsList = ({ onNavigate, onReview }: AppointmentsListProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services (nome, descricao),
          pets (nome, especie, foto),
          establishments (nome, endereco)
        `)
        .eq('user_id', user?.id)
        .order('data_agendamento', { ascending: false })
        .order('horario_inicio', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        setAppointments(data || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-primary text-white';
      case 'concluido':
        return 'bg-green-500 text-white';
      case 'cancelado':
        return 'bg-red-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="bg-background border-b border-border p-4">
          <div className="flex items-center">
            <button onClick={() => onNavigate("home")} className="p-2 hover:bg-muted rounded-full mr-2">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Meus Agendamentos</h1>
          </div>
        </header>
        
        <main className="p-4">
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando agendamentos...</p>
          </div>
        </main>
        
        <BottomNavigation activeTab="appointments" onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-background border-b border-border p-4">
        <div className="flex items-center">
          <button onClick={() => onNavigate("home")} className="p-2 hover:bg-muted rounded-full mr-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Meus Agendamentos</h1>
        </div>
      </header>

      <main className="p-4">
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Você ainda não possui agendamentos
            </p>
            <Button 
              onClick={() => onNavigate("home")}
              className="bg-primary hover:bg-primary/90"
            >
              Fazer primeiro agendamento
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="shadow-[var(--shadow-card)] border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {appointment.pets.foto ? (
                        <img 
                          src={appointment.pets.foto} 
                          alt={appointment.pets.nome}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-base">{appointment.services.nome}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {appointment.pets.nome} • {appointment.pets.especie}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDate(appointment.data_agendamento)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{appointment.horario_inicio} - {appointment.horario_fim}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1">
                      {appointment.establishments.nome}
                      {appointment.establishments.endereco?.rua && (
                        <span className="text-muted-foreground">
                          {" • "}{appointment.establishments.endereco.rua}
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="font-medium">
                      R$ {appointment.preco_final.toFixed(2)}
                    </span>
                    
                    {appointment.status === 'concluido' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={onReview}
                        className="text-primary border-primary hover:bg-primary/10"
                      >
                        Avaliar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <BottomNavigation activeTab="appointments" onNavigate={onNavigate} />
    </div>
  );
};