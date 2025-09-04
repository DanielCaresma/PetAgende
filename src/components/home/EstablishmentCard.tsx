import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";

interface EstablishmentCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  onClick: () => void;
}

export const EstablishmentCard = ({
  name,
  image,
  rating,
  reviewCount,
  distance,
  address,
  onClick
}: EstablishmentCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-[var(--shadow-primary)] transition-[var(--transition-smooth)] border-0 bg-card"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={image} 
            alt={name}
            className="w-full h-32 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs font-medium">
            {distance}
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground truncate">{name}</h3>
          
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{address}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};