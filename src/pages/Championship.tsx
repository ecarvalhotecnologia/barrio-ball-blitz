
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getChampionshipById } from "@/utils/tournamentUtils";

// Newly created components
import ChampionshipHeader from "@/components/championship/ChampionshipHeader";
import TournamentContainer from "@/components/championship/TournamentContainer";
import TeamsList from "@/components/championship/TeamsList";
import ChampionshipResults from "@/components/championship/ChampionshipResults";
import { useChampionshipMatch } from "@/hooks/useChampionshipMatch";

const Championship = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [championshipData, setChampionshipData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Não autorizado",
        description: "Por favor, faça login para visualizar este campeonato",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (id) {
      const loadedChampionship = getChampionshipById(id);
      
      if (loadedChampionship) {
        setChampionshipData(loadedChampionship);
      } else {
        toast({
          title: "Erro",
          description: "Campeonato não encontrado",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    }
    
    setIsLoading(false);
  }, [id, isAuthenticated, navigate, toast]);
  
  // If we have championship data, use our custom hook
  const {
    championship,
    isSimulating,
    handleSimulateMatch,
    handleManualScore,
    handleSimulateAll
  } = useChampionshipMatch(championshipData || null);
  
  if (isLoading || !championship) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-pulse h-8 w-48 bg-gray-200 rounded mx-auto mb-4" />
            <div className="animate-pulse h-4 w-64 bg-gray-200 rounded mx-auto" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Championship Header */}
        <ChampionshipHeader 
          championship={championship}
          isSimulating={isSimulating}
          onSimulateAll={handleSimulateAll}
        />
        
        {/* Tournament Bracket */}
        <TournamentContainer
          championship={championship}
          onSimulateMatch={handleSimulateMatch}
          onManualScore={handleManualScore}
        />
        
        {/* Championship Information */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Teams List */}
          <TeamsList teams={championship.teams} />
          
          {/* Championship Results */}
          <ChampionshipResults
            championship={championship}
            isSimulating={isSimulating}
            onSimulateAll={handleSimulateAll}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Championship;
