import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface CalendarBookingProps {
  petId: string;
  serviceId: string;
  onBack: () => void;
  onBook: (date: string, time: string) => void;
}

export const CalendarBooking = ({ petId, serviceId, onBack, onBook }: CalendarBookingProps) => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentMonth] = useState("Junho 2025");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Mock available times
  const availableTimes = ["10:50", "10:55", "11:00", "11:05", "14:00", "14:30", "15:00", "16:15"];
  
  // Mock calendar days (simplified for demo)
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  
  const handleDateSelect = (day: number) => {
    setSelectedDate(day);
    setSelectedTime(""); // Reset time selection
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBook = async () => {
    if (selectedDate && selectedTime && user) {
      setLoading(true);
      
      try {
        // Get service details for pricing and duration
        const { data: service, error: serviceError } = await supabase
          .from('services')
          .select('*, establishments!inner(*)')
          .eq('id', serviceId)
          .single();

        if (serviceError) {
          throw serviceError;
        }

        // Calculate end time based on service duration
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const endMinutes = minutes + service.duracao;
        const endHours = hours + Math.floor(endMinutes / 60);
        const endTime = `${endHours.toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

        // Create appointment
        const { error: appointmentError } = await supabase
          .from('appointments')
          .insert([{
            user_id: user.id,
            pet_id: petId,
            service_id: serviceId,
            establishment_id: service.establishment_id,
            data_agendamento: `2025-06-${selectedDate.toString().padStart(2, '0')}`,
            horario_inicio: startTime,
            horario_fim: endTime,
            preco_final: service.preco,
            status: 'agendado'
          }]);

        if (appointmentError) {
          throw appointmentError;
        }

        toast({
          title: "Agendamento realizado com sucesso!",
          description: `Seu pet está agendado para ${selectedDate}/06/2025 às ${selectedTime}`,
        });

        onBook(`${selectedDate}/06/2025`, selectedTime);
      } catch (error) {
        console.error('Error creating appointment:', error);
        toast({
          title: "Erro ao agendar",
          description: "Não foi possível realizar o agendamento. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border p-4">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-full mr-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Agendar</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Calendar */}
        <Card className="shadow-[var(--shadow-card)] border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <button className="p-2 hover:bg-muted rounded-full">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <CardTitle className="text-lg">{currentMonth}</CardTitle>
              <button className="p-2 hover:bg-muted rounded-full">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Weekday headers */}
              {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
                <div key={index} className="text-center text-sm text-muted-foreground p-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map((day) => (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  disabled={day < 10} // Disable past dates for demo
                  className={`
                    h-10 rounded-lg text-sm font-medium transition-colors
                    ${day < 10 
                      ? "text-muted-foreground cursor-not-allowed" 
                      : "hover:bg-muted cursor-pointer"
                    }
                    ${selectedDate === day 
                      ? "bg-secondary text-white" 
                      : "text-foreground"
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Times */}
        {selectedDate && (
          <Card className="shadow-[var(--shadow-card)] border-0">
            <CardHeader>
              <CardTitle className="text-lg">Horários Disponíveis</CardTitle>
              <p className="text-sm text-muted-foreground">
                {selectedDate} de Junho, 2025
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`
                      h-10 rounded-lg text-sm font-medium transition-colors border
                      ${selectedTime === time
                        ? "bg-primary text-white border-primary"
                        : "bg-card hover:bg-muted border-border"
                      }
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Book Button */}
        <Button 
          onClick={handleBook}
          disabled={!selectedDate || !selectedTime || loading}
          className="w-full h-12 bg-primary hover:bg-primary/90 transition-[var(--transition-smooth)]"
        >
          {loading ? "Agendando..." : "Agendar"}
        </Button>
      </main>
    </div>
  );
};