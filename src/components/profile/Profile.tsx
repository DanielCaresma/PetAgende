import { useState, useEffect } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit, LogOut, Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/petagende-logo.png";

interface ProfileProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Profile = ({ onNavigate, onLogout }: ProfileProps) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: profile?.nome || "",
    telefone: profile?.telefone || "",
    cpf: profile?.cpf || "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome || "",
        telefone: profile.telefone || "",
        cpf: profile.cpf || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: formData.nome,
          telefone: formData.telefone,
          cpf: formData.cpf,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: profile?.nome || "",
      telefone: profile?.telefone || "",
      cpf: profile?.cpf || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="PetAgende" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-lg font-bold text-secondary">Meu Perfil</h1>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="p-4 space-y-6">
        {/* Profile Picture Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.foto_perfil || ""} />
                  <AvatarFallback className="bg-secondary text-white text-2xl">
                    {profile?.nome?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 border-background"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{profile?.nome}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Informações Pessoais</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              {isEditing ? (
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Seu nome completo"
                />
              ) : (
                <p className="text-sm border rounded-md px-3 py-2 bg-muted/50">
                  {profile?.nome || "Não informado"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <p className="text-sm border rounded-md px-3 py-2 bg-muted/50">
                {user?.email}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              {isEditing ? (
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              ) : (
                <p className="text-sm border rounded-md px-3 py-2 bg-muted/50">
                  {profile?.telefone || "Não informado"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              {isEditing ? (
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                />
              ) : (
                <p className="text-sm border rounded-md px-3 py-2 bg-muted/50">
                  {profile?.cpf || "Não informado"}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  Salvar
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={onLogout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da conta
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation activeTab="profile" onNavigate={onNavigate} />
    </div>
  );
};