
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Championship, 
  simulateMatch, 
  progressTournament, 
  updateChampionship, 
  simulateEntireChampionship 
} from "@/utils/tournamentUtils";

export const useChampionshipMatch = (initialChampionship: Championship) => {
  const [championship, setChampionship] = useState<Championship>(initialChampionship);
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

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

  return {
    championship,
    isSimulating,
    handleSimulateMatch,
    handleManualScore,
    handleSimulateAll
  };
};
