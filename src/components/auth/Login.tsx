import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@/assets/petagende-logo.png";

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<any>;
  onCreateAccount: () => void;
}

export const Login = ({ onLogin, onCreateAccount }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await onLogin(email, password);
    
    if (error) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-card)] border-0">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex flex-col items-center space-y-4">
            <img 
              src={logoImage} 
              alt="PetAgende" 
              className="w-20 h-20 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-secondary">PetAgende</h1>
              <h2 className="text-xl text-foreground mt-2">Boas-vindas!</h2>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="CPF ou Email"
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
              />
            </div>

            <div className="text-right">
              <button 
                type="button"
                className="text-sm text-primary hover:underline transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 transition-[var(--transition-smooth)]"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <Button 
            variant="outline"
            onClick={onCreateAccount}
            className="w-full h-12 border-primary text-primary hover:bg-primary/10 transition-[var(--transition-smooth)]"
          >
            Criar conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};