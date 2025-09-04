import { useState } from "react";
import { Login } from "@/components/auth/Login";
import { SignUp } from "@/components/auth/SignUp";
import { Home } from "@/components/home/Home";
import { Profile } from "@/components/profile/Profile";
import { Search } from "@/components/search/Search";
import { PetSelection } from "@/components/booking/PetSelection";
import { ServiceSelection } from "@/components/booking/ServiceSelection";
import { CalendarBooking } from "@/components/booking/CalendarBooking";
import { ReviewSystem } from "@/components/booking/ReviewSystem";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("login");
  const [authPage, setAuthPage] = useState<"login" | "signup">("login"); 
  const { user, profile, loading, signIn, signUp, signOut } = useAuth();
  const { toast } = useToast();
  
  // Booking flow state
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  const handleLogin = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (!result.error) {
      setCurrentPage("home");
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao PetAgende",
      });
    }
    return result;
  };

  const handleSignUp = async (email: string, password: string, nome: string, cpf?: string) => {
    const result = await signUp(email, password, nome, cpf);
    if (!result.error) {
      setAuthPage("login");
    }
    return result;
  };

  const handleCreateAccount = () => {
    setAuthPage("signup");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleBookingComplete = (date: string, time: string) => {
    toast({
      title: "Agendamento confirmado!",
      description: `Seu pet estará agendado para ${date} às ${time}`,
    });
    setCurrentPage("home");
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    toast({
      title: "Avaliação enviada!",
      description: `Obrigado pelo seu feedback de ${rating} estrelas`,
    });
    setCurrentPage("home");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authPage === "signup") {
      return (
        <SignUp 
          onSignUp={handleSignUp}
          onBack={() => setAuthPage("login")}
        />
      );
    }
    
    return (
      <Login 
        onLogin={handleLogin}
        onCreateAccount={handleCreateAccount}
      />
    );
  }

  // Render current page
  switch (currentPage) {
    case "search":
      return (
        <Search onNavigate={handleNavigate} />
      );
    
    case "profile":
      return (
        <Profile 
          onNavigate={handleNavigate}
          onLogout={signOut}
        />
      );
    
    case "pet-selection":
      return (
        <PetSelection
          userName={profile?.nome || "Usuário"}
          onBack={() => setCurrentPage("home")}
          onNext={(petId: string) => {
            setSelectedPetId(petId);
            setCurrentPage("service-selection");
          }}
        />
      );
    
    case "service-selection":
      return (
        <ServiceSelection
          userName={profile?.nome || "Usuário"}
          onBack={() => setCurrentPage("pet-selection")}
          onNext={(serviceId: string) => {
            setSelectedServiceId(serviceId);
            setCurrentPage("calendar");
          }}
        />
      );
    
    case "calendar":
      return (
        <CalendarBooking
          petId={selectedPetId}
          serviceId={selectedServiceId}
          onBack={() => setCurrentPage("service-selection")}
          onBook={handleBookingComplete}
        />
      );
    
    case "review":
      return (
        <ReviewSystem
          onBack={() => setCurrentPage("home")}
          onSubmitReview={handleReviewSubmit}
        />
      );
    
    case "appointments":
      return (
        <AppointmentsList
          onNavigate={handleNavigate}
          onReview={() => setCurrentPage("review")}
        />
      );
    
    default:
      return (
        <Home 
          userName={profile?.nome || "Usuário"}
          onNavigate={handleNavigate}
          onLogout={signOut}
        />
      );
  }
};

export default Index;
