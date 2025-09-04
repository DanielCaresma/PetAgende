import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePets } from "@/hooks/usePets";
import { PetRegistrationForm } from "@/components/pets/PetRegistrationForm";

interface PetSelectionProps {
  userName: string;
  onBack: () => void;
  onNext: (petId: string) => void;
}

export const PetSelection = ({ userName, onBack, onNext }: PetSelectionProps) => {
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { user } = useAuth();
  const { pets, loading } = usePets(user?.id);

  const handleNext = () => {
    if (selectedPet) {
      onNext(selectedPet);
    }
  };

  const handlePetRegistrationSuccess = (petId: string) => {
    setSelectedPet(petId);
    setShowRegistrationForm(false);
  };

  if (showRegistrationForm) {
    return (
      <PetRegistrationForm
        userId={user?.id || ""}
        onBack={() => setShowRegistrationForm(false)}
        onSuccess={handlePetRegistrationSuccess}
      />
    );
  }

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
            <CardTitle className="text-center text-xl">Selecionar Pet</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {loading ? (
              <div className="text-center py-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-muted-foreground">Carregando pets...</p>
              </div>
            ) : pets.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Nenhum pet cadastrado</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Você precisa cadastrar pelo menos um pet para fazer agendamentos
                  </p>
                  <Button variant="outline" onClick={() => setShowRegistrationForm(true)}>
                    Cadastrar meu primeiro pet
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Select value={selectedPet} onValueChange={setSelectedPet}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecionar Pet" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id} className="hover:bg-muted">
                        <div className="flex items-center space-x-3 w-full">
                          {pet.foto && (
                            <img 
                              src={pet.foto} 
                              alt={pet.nome}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div className="text-left">
                            <div className="font-medium">{pet.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {pet.especie} • {pet.raca || 'Sem raça definida'}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedPet && (
                  <div className="bg-muted p-4 rounded-lg">
                    {(() => {
                      const pet = pets.find(p => p.id === selectedPet);
                      return pet ? (
                        <div className="flex items-center space-x-3">
                          {pet.foto && (
                            <img 
                              src={pet.foto} 
                              alt={pet.nome}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold">{pet.nome}</h3>
                            <p className="text-sm text-muted-foreground">
                              {pet.especie} • {pet.raca || 'Sem raça definida'}
                            </p>
                            {pet.idade && (
                              <p className="text-sm text-muted-foreground">
                                {pet.idade} anos
                              </p>
                            )}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    onClick={handleNext}
                    disabled={!selectedPet}
                    className="w-full h-12 bg-primary hover:bg-primary/90 transition-[var(--transition-smooth)]"
                  >
                    Selecionar
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setShowRegistrationForm(true)}
                    className="w-full h-12"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar novo pet
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};