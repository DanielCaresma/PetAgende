import { Home, Search, Calendar, User } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNavigation = ({ activeTab, onNavigate }: BottomNavigationProps) => {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: Search, label: "Pesquisa" },
    { id: "appointments", icon: Calendar, label: "Agendamentos" },
    { id: "profile", icon: User, label: "Perfil" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
              activeTab === id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};