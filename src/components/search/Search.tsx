import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EstablishmentCard } from "@/components/home/EstablishmentCard";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Search as SearchIcon, Filter, MapPin } from "lucide-react";
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

interface Service {
  id: string;
  nome: string;
  categoria: string;
  establishment_id: string;
}

interface SearchProps {
  onNavigate: (page: string) => void;
}

export const Search = ({ onNavigate }: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchType, setSearchType] = useState<"establishments" | "services">("establishments");

  const categories = [
    "Banho e Tosa",
    "Veterinário", 
    "Pet Shop",
    "Hotel",
    "Adestramento",
    "Fisioterapia"
  ];

  useEffect(() => {
    if (searchQuery.trim() || selectedCategory) {
      performSearch();
    } else {
      setEstablishments([]);
      setServices([]);
    }
  }, [searchQuery, selectedCategory, searchType]);

  const performSearch = async () => {
    setLoading(true);
    try {
      if (searchType === "establishments") {
        await searchEstablishments();
      } else {
        await searchServices();
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchEstablishments = async () => {
    let query = supabase
      .from('establishments')
      .select('*')
      .eq('status', 'ativo');

    if (searchQuery.trim()) {
      query = query.ilike('nome', `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching establishments:', error);
      return;
    }

    setEstablishments(data || []);
  };

  const searchServices = async () => {
    let query = supabase
      .from('services')
      .select(`
        *,
        establishments!inner(*)
      `)
      .eq('status', 'ativo')
      .eq('establishments.status', 'ativo');

    if (searchQuery.trim()) {
      query = query.ilike('nome', `%${searchQuery}%`);
    }

    if (selectedCategory) {
      query = query.eq('categoria', selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching services:', error);
      return;
    }

    setServices(data || []);
  };

  const handleEstablishmentClick = () => {
    onNavigate("pet-selection");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setEstablishments([]);
    setServices([]);
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="PetAgende" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-lg font-bold text-secondary">Pesquisar</h1>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar estabelecimentos ou serviços..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 border-border/50 bg-input"
          />
        </div>

        {/* Search Type Toggle */}
        <div className="flex space-x-2 mt-3">
          <Button
            variant={searchType === "establishments" ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchType("establishments")}
          >
            <MapPin className="w-4 h-4 mr-1" />
            Estabelecimentos
          </Button>
          <Button
            variant={searchType === "services" ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchType("services")}
          >
            <Filter className="w-4 h-4 mr-1" />
            Serviços
          </Button>
        </div>
      </header>

      {/* Categories Filter */}
      {searchType === "services" && (
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          {(searchQuery || selectedCategory) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="mt-2 text-muted-foreground"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      )}

      {/* Results */}
      <main className="p-4">
        {!searchQuery.trim() && !selectedCategory ? (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Encontre o melhor para seu pet</h3>
            <p className="text-muted-foreground mb-4">
              Digite o que você procura ou navegue pelas categorias
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg p-4 border animate-pulse">
                <div className="w-full h-32 bg-muted rounded-lg mb-3"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : searchType === "establishments" ? (
          <>
            {establishments.length > 0 ? (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  {establishments.length} estabelecimento{establishments.length !== 1 ? 's' : ''} encontrado{establishments.length !== 1 ? 's' : ''}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {establishments.map((establishment) => (
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
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum estabelecimento encontrado</p>
              </div>
            )}
          </>
        ) : (
          <>
            {services.length > 0 ? (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  {services.length} serviço{services.length !== 1 ? 's' : ''} encontrado{services.length !== 1 ? 's' : ''}
                </h2>
                <div className="space-y-4">
                  {services.map((service: any) => (
                    <div
                      key={service.id}
                      className="bg-card rounded-lg p-4 border cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={handleEstablishmentClick}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{service.nome}</h3>
                          <p className="text-sm text-muted-foreground">{service.establishments?.nome}</p>
                        </div>
                        <Badge variant="secondary">{service.categoria}</Badge>
                      </div>
                      {service.descricao && (
                        <p className="text-sm text-muted-foreground mb-2">{service.descricao}</p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary font-medium">
                          R$ {service.preco?.toFixed(2)}
                        </span>
                        <span className="text-muted-foreground">
                          {service.duracao} min
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum serviço encontrado</p>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNavigation activeTab="search" onNavigate={onNavigate} />
    </div>
  );
};