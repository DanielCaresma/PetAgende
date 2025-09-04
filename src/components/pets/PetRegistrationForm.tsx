import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2 } from "lucide-react";
import { usePets } from "@/hooks/usePets";
import { useToast } from "@/hooks/use-toast";

interface PetRegistrationFormProps {
  userId: string;
  onBack: () => void;
  onSuccess: (petId: string) => void;
}

export const PetRegistrationForm = ({ userId, onBack, onSuccess }: PetRegistrationFormProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    especie: "",
    raca: "",
    idade: "",
    peso: "",
    sexo: "",
    cor: "",
    observacoes: "",
    vacinacao_em_dia: false
  });
  const [loading, setLoading] = useState(false);
  const { addPet } = usePets(userId);
  const { toast } = useToast();

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const petData = {
        nome: formData.nome,
        especie: formData.especie,
        raca: formData.raca || undefined,
        idade: formData.idade ? parseInt(formData.idade) : undefined,
        peso: formData.peso ? parseFloat(formData.peso) : undefined,
        sexo: formData.sexo || undefined,
        cor: formData.cor || undefined,
        observacoes: formData.observacoes || undefined,
        vacinacao_em_dia: formData.vacinacao_em_dia
      };

      const result = await addPet(petData);
      
      if (result?.error) {
        toast({
          title: "Erro ao cadastrar pet",
          description: "Tente novamente mais tarde",
          variant: "destructive"
        });
      } else if (result?.data) {
        toast({
          title: "Pet cadastrado com sucesso!",
          description: `${formData.nome} foi adicionado aos seus pets`
        });
        onSuccess(result.data.id);
      }
    } catch (error) {
      toast({
        title: "Erro ao cadastrar pet",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.nome.trim() && formData.especie.trim();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border p-4">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="ml-4 text-lg font-semibold">Cadastrar Pet</h1>
        </div>
      </header>

      <main className="p-4">
        <Card className="shadow-[var(--shadow-card)] border-0">
          <CardHeader>
            <CardTitle className="text-center text-xl">Novo Pet</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Pet *</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Ex: Rex"
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Espécie */}
              <div className="space-y-2">
                <Label>Espécie *</Label>
                <Select value={formData.especie} onValueChange={(value) => handleChange("especie", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione a espécie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cão">Cachorro</SelectItem>
                    <SelectItem value="gato">Gato</SelectItem>
                    <SelectItem value="outro">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Raça */}
              <div className="space-y-2">
                <Label htmlFor="raca">Raça</Label>
                <Input
                  id="raca"
                  type="text"
                  placeholder="Ex: Labrador, SRD"
                  value={formData.raca}
                  onChange={(e) => handleChange("raca", e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Idade e Peso */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idade">Idade (anos)</Label>
                  <Input
                    id="idade"
                    type="number"
                    placeholder="Ex: 3"
                    value={formData.idade}
                    onChange={(e) => handleChange("idade", e.target.value)}
                    className="h-12"
                    min="0"
                    max="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    placeholder="Ex: 15.5"
                    value={formData.peso}
                    onChange={(e) => handleChange("peso", e.target.value)}
                    className="h-12"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Sexo */}
              <div className="space-y-2">
                <Label>Sexo</Label>
                <Select value={formData.sexo} onValueChange={(value) => handleChange("sexo", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="macho">Macho</SelectItem>
                    <SelectItem value="fêmea">Fêmea</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cor */}
              <div className="space-y-2">
                <Label htmlFor="cor">Cor</Label>
                <Input
                  id="cor"
                  type="text"
                  placeholder="Ex: Marrom, Preto, Branco"
                  value={formData.cor}
                  onChange={(e) => handleChange("cor", e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Vacinação */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base">Vacinação em dia</Label>
                  <p className="text-sm text-muted-foreground">
                    O pet está com as vacinas em dia?
                  </p>
                </div>
                <Switch
                  checked={formData.vacinacao_em_dia}
                  onCheckedChange={(checked) => handleChange("vacinacao_em_dia", checked)}
                />
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais sobre o pet (alergias, medicações, comportamento, etc.)"
                  value={formData.observacoes}
                  onChange={(e) => handleChange("observacoes", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 transition-[var(--transition-smooth)]"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? "Cadastrando..." : "Cadastrar Pet"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};