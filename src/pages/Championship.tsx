
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TournamentBracket from "@/components/TournamentBracket";
import TeamCard from "@/components/TeamCard";
import {
  Championship as ChampionshipType,
  getChampionshipById,
  updateChampionship,
  simulateMatch,
  progressTournament,
  simulateEntireChampionship
} from "@/utils/tournamentUtils";

const Championship = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [championship, setChampionship] = useState<ChampionshipType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  
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
        setChampionship(loadedChampionship);
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
  
  const handleSimulateMatch = (matchId: string) => {
    if (!championship) return;
    
    // Find the match to simulate
    const matchIndex = championship.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return;
    
    // Simulate the match
    const updatedMatches = [...championship.matches];
    updatedMatches[matchIndex] = simulateMatch(updatedMatches[matchIndex]);
    
    // Create updated championship
    const updatedChampionship = {
      ...championship,
      matches: updatedMatches,
    };
    
    // Progress the tournament based on simulated match
    const progressedChampionship = progressTournament(updatedChampionship);
    
    // Update championship state and storage
    setChampionship(progressedChampionship);
    updateChampionship(progressedChampionship);
    
    toast({
      title: "Partida Simulada",
      description: `Placar final: ${updatedMatches[matchIndex].team1.name} ${updatedMatches[matchIndex].team1Goals} - ${updatedMatches[matchIndex].team2Goals} ${updatedMatches[matchIndex].team2.name}`,
    });
  };
  
  const handleManualScore = (matchId: string, team1Goals: number, team2Goals: number) => {
    if (!championship) return;
    
    // Find the match to update
    const matchIndex = championship.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return;
    
    // Create a copy of the match
    const match = { ...championship.matches[matchIndex] };
    
    // Update match with manual score
    match.team1Goals = team1Goals;
    match.team2Goals = team2Goals;
    match.played = true;
    
    // Determine winner
    if (team1Goals > team2Goals) {
      match.winner = match.team1;
    } else if (team2Goals > team1Goals) {
      match.winner = match.team2;
    } else {
      // Tiebreaker rule based on accumulated points
      const team1Points = match.team1.points;
      const team2Points = match.team2.points;
      
      if (team1Points > team2Points) {
        match.winner = match.team1;
      } else if (team2Points > team1Points) {
        match.winner = match.team2;
      } else {
        // Tiebreaker based on registration order
        match.winner = match.team1.registrationOrder < match.team2.registrationOrder ? match.team1 : match.team2;
      }
    }
    
    // Update points for teams
    match.team1.points += team1Goals - team2Goals;
    match.team2.points += team2Goals - team1Goals;
    
    // Update the matches array
    const updatedMatches = [...championship.matches];
    updatedMatches[matchIndex] = match;
    
    // Create updated championship
    const updatedChampionship = {
      ...championship,
      matches: updatedMatches,
    };
    
    // Progress the tournament based on the match result
    const progressedChampionship = progressTournament(updatedChampionship);
    
    // Update championship state and storage
    setChampionship(progressedChampionship);
    updateChampionship(progressedChampionship);
    
    toast({
      title: "Placar Registrado",
      description: `Placar final: ${match.team1.name} ${team1Goals} - ${team2Goals} ${match.team2.name}`,
    });
  };
  
  const handleSimulateAll = () => {
    if (!championship) return;
    
    setIsSimulating(true);
    
    try {
      // Simulate the entire championship
      const simulatedChampionship = simulateEntireChampionship(championship);
      
      // Update championship state and storage
      setChampionship(simulatedChampionship);
      updateChampionship(simulatedChampionship);
      
      toast({
        title: "Campeonato Concluído",
        description: `${simulatedChampionship.winner?.name} é o campeão!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao simular campeonato",
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
    }
  };
  
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">{championship.name}</h1>
                {championship.completed && (
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Concluído
                  </span>
                )}
              </div>
              <p className="text-gray-600">
                Criado em {new Date(championship.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-4">
              <Link to="/dashboard">
                <Button variant="outline">
                  Voltar ao Painel
                </Button>
              </Link>
              
              {!championship.completed && (
                <Button
                  className="bg-championship-primary hover:bg-championship-secondary"
                  onClick={handleSimulateAll}
                  disabled={isSimulating}
                >
                  {isSimulating ? "Simulando..." : "Simular Todos"}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Tournament Bracket */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-6 text-center">Chaves do Torneio</h2>
          <TournamentBracket
            championship={championship}
            onSimulateMatch={!championship.completed ? handleSimulateMatch : undefined}
            onManualScore={!championship.completed ? handleManualScore : undefined}
          />
        </div>
        
        {/* Championship Information */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Teams List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Equipes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {championship.teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </div>
          
          {/* Championship Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Status do Campeonato</h2>
            
            {championship.completed ? (
              <div>
                <div className="bg-championship-light rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-championship-primary mb-4">Resultados Finais</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-championship-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                        1
                      </div>
                      <div>
                        <span className="font-semibold">{championship.winner?.name}</span>
                        <span className="text-sm text-gray-500 block">Campeão</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-championship-secondary text-white rounded-full flex items-center justify-center font-bold mr-3">
                        2
                      </div>
                      <div>
                        <span className="font-semibold">{championship.runnerUp?.name}</span>
                        <span className="text-sm text-gray-500 block">Vice-Campeão</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        3
                      </div>
                      <div>
                        <span className="font-semibold">{championship.thirdPlace?.name}</span>
                        <span className="text-sm text-gray-500 block">Terceiro Lugar</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        4
                      </div>
                      <div>
                        <span className="font-semibold">{championship.fourthPlace?.name}</span>
                        <span className="text-sm text-gray-500 block">Quarto Lugar</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Link to="/create-championship">
                  <Button className="w-full bg-championship-primary hover:bg-championship-secondary">
                    Criar Novo Campeonato
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-6">
                  Este campeonato está em andamento. Simule as partidas para continuar o torneio ou insira os placares manualmente.
                </p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Partidas Realizadas</span>
                    <span className="font-semibold">
                      {championship.matches.filter(m => m.played).length} / 7
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rodada Atual</span>
                    <span className="font-semibold">
                      {championship.matches.filter(m => m.round === 1 && m.played).length === 4
                        ? championship.matches.filter(m => m.round === 2 && m.played).length === 2
                          ? "Finais"
                          : "Semifinais"
                        : "Quartas de Final"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Próxima Ação</span>
                    <span className="font-semibold text-championship-primary">
                      {championship.matches.filter(m => m.round === 1 && m.played).length < 4
                        ? "Simular Quartas de Final"
                        : championship.matches.filter(m => m.round === 2 && m.played).length < 2
                        ? "Simular Semifinais"
                        : "Simular Finais"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button
                    className="w-full bg-championship-primary hover:bg-championship-secondary"
                    onClick={handleSimulateAll}
                    disabled={isSimulating}
                  >
                    {isSimulating ? "Simulando..." : "Simular Todas as Partidas Restantes"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Championship;
