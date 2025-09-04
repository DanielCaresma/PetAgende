import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { EstablishmentCard } from "./EstablishmentCard";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Search, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/petagende-logo.png";

interface Establishment {
  id: string;
  nome: string;
  descricao: string;
  avaliacao_media: number;
  total_avaliacoes: number;
  fotos?: any;
  endereco?: any;
}

interface HomeProps {
  userName: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Home = ({ userName, onNavigate, onLogout }: HomeProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const fetchEstablishments = async () => {
    try {
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .eq('status', 'ativo');

      if (error) {
        console.error('Error fetching establishments:', error);
      } else {
        setEstablishments(data || []);
      }
    } catch (error) {
      console.error('Error fetching establishments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEstablishments = establishments.filter(establishment =>
    establishment.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEstablishmentClick = () => {
    onNavigate("pet-selection");
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="PetAgende" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-lg font-bold text-secondary">PetAgende</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Olá, {userName}</span>
            <button 
              onClick={onLogout}
              className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <User className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar estabelecimentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 border-border/50 bg-input"
          />
        </div>
      </header>

      {/* Establishments Grid */}
      <main className="p-4">
        <h2 className="text-lg font-semibold mb-4">Estabelecimentos próximos</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-lg p-4 border animate-pulse">
                <div className="w-full h-32 bg-muted rounded-lg mb-3"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEstablishments.map((establishment) => (
              <EstablishmentCard
                key={establishment.id}
                id={establishment.id}
                name={establishment.nome}
                image={(establishment.fotos && Array.isArray(establishment.fotos) && establishment.fotos[0]) || "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=200&fit=crop"}
                rating={establishment.avaliacao_media}
                reviewCount={establishment.total_avaliacoes}
                distance="-- km"
                address={establishment.endereco?.rua ? `${establishment.endereco.rua} - ${establishment.endereco.bairro}` : "Endereço não informado"}
                onClick={handleEstablishmentClick}
              />
            ))}
          </div>
        )}
        
        {!loading && filteredEstablishments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum estabelecimento encontrado</p>
          </div>
        )}
      </main>

      <BottomNavigation activeTab="home" onNavigate={onNavigate} />
    </div>
  );
};