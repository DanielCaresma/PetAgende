import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@/assets/petagende-logo.png";

interface SignUpProps {
  onSignUp: (email: string, password: string, nome: string, cpf?: string) => Promise<any>;
  onBack: () => void;
}

export const SignUp = ({ onSignUp, onBack }: SignUpProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
  };

  const formatCPF = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const formatted = cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return formatted;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    if (cpf && !validateCPF(cpf)) {
      toast({
        title: "Erro",
        description: "CPF inválido",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { error } = await onSignUp(email, password, nome, cpf || undefined);
    
    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu email para confirmar a conta",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-card)] border-0">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex items-center mb-4">
            <button onClick={onBack} className="p-2 hover:bg-muted rounded-full mr-2">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold flex-1">Criar conta</h1>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <img 
              src={logoImage} 
              alt="PetAgende" 
              className="w-20 h-20 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-secondary">PetAgende</h1>
              <h2 className="text-xl text-foreground mt-2">Bem-vindo!</h2>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="h-12 border-border/50 focus:ring-primary"
                required
              />
            </div>

            <div>
              <Input
                type="text"
                placeholder="CPF (opcional)"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                className="h-12 border-border/50 focus:ring-primary"
                maxLength={14}
              />
            </div>
            
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-border/50 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-border/50 focus:ring-primary"
                required
                minLength={6}
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 border-border/50 focus:ring-primary"
                required
                minLength={6}
              />
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 transition-[var(--transition-smooth)]"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};