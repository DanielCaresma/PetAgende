import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ReviewSystemProps {
  appointmentId?: string;
  establishmentId?: string;
  onBack: () => void;
  onSubmitReview: (rating: number, comment: string) => void;
}

export const ReviewSystem = ({ appointmentId, establishmentId, onBack, onSubmitReview }: ReviewSystemProps) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Avaliação obrigatória",
        description: "Por favor, selecione uma nota de 1 a 5 estrelas",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para avaliar",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // If we have appointmentId and establishmentId, save to database
      if (appointmentId && establishmentId) {
        const { error } = await supabase
          .from('reviews')
          .insert([{
            user_id: user.id,
            appointment_id: appointmentId,
            establishment_id: establishmentId,
            nota: rating,
            comentario: comment || null
          }]);

        if (error) {
          throw error;
        }

        toast({
          title: "Avaliação enviada com sucesso!",
          description: `Obrigado pelo seu feedback de ${rating} estrelas`,
        });
      }

      onSubmitReview(rating, comment);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Erro ao enviar avaliação",
        description: "Não foi possível enviar sua avaliação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border p-4">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-full mr-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Avaliar</h1>
        </div>
      </header>

      <main className="p-4">
        <Card className="shadow-[var(--shadow-card)] border-0">
          <CardHeader>
            <CardTitle className="text-center text-xl">Avalie sua experiência</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <div className="flex justify-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-accent text-accent"
                          : "text-border"
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              {rating > 0 && (
                <p className="text-sm text-muted-foreground">
                  {rating === 1 && "Muito ruim"}
                  {rating === 2 && "Ruim"}
                  {rating === 3 && "Regular"}
                  {rating === 4 && "Bom"}
                  {rating === 5 && "Excelente"}
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Descreva sua experiência
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte-nos como foi seu atendimento..."
                className="min-h-24 resize-none border-border/50 focus:ring-primary"
              />
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={rating === 0 || loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 transition-[var(--transition-smooth)]"
            >
              {loading ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};