import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, Clock, DollarSign } from "lucide-react";
import { useServices } from "@/hooks/useServices";

interface ServiceSelectionProps {
  userName: string;
  onBack: () => void;
  onNext: (serviceId: string) => void;
}

export const ServiceSelection = ({ userName, onBack, onNext }: ServiceSelectionProps) => {
  const [selectedService, setSelectedService] = useState<string>("");
  const { services, loading } = useServices(); // Fetch all services for now

  const handleNext = () => {
    if (selectedService) {
      onNext(selectedService);
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Olá, {userName}</span>
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      <main className="p-4">
        <Card className="shadow-[var(--shadow-card)] border-0">
          <CardHeader>
            <CardTitle className="text-center text-xl">Selecionar Serviço</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {loading ? (
              <div className="text-center py-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-muted-foreground">Carregando serviços...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum serviço disponível</p>
              </div>
            ) : (
              <>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecionar serviço" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id} className="hover:bg-muted">
                        <div className="text-left w-full">
                          <div className="font-medium">{service.nome}</div>
                          <div className="text-sm text-muted-foreground flex items-center space-x-2">
                            <span>R$ {service.preco.toFixed(2)}</span>
                            <span>•</span>
                            <span>{service.duracao} min</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedServiceData && (
                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <h3 className="font-semibold text-lg">{selectedServiceData.nome}</h3>
                    <p className="text-sm text-muted-foreground">{selectedServiceData.descricao}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="font-medium">R$ {selectedServiceData.preco.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{selectedServiceData.duracao} minutos</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleNext}
                  disabled={!selectedService}
                  className="w-full h-12 bg-primary hover:bg-primary/90 transition-[var(--transition-smooth)]"
                >
                  Selecionar
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};