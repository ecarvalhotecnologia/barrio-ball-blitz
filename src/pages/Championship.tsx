
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
        title: "Not authorized",
        description: "Please log in to view this championship",
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
          title: "Error",
          description: "Championship not found",
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
      title: "Match Simulated",
      description: `Final score: ${updatedMatches[matchIndex].team1.name} ${updatedMatches[matchIndex].team1Goals} - ${updatedMatches[matchIndex].team2Goals} ${updatedMatches[matchIndex].team2.name}`,
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
        title: "Championship Completed",
        description: `${simulatedChampionship.winner?.name} is the champion!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to simulate championship",
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
                    Completed
                  </span>
                )}
              </div>
              <p className="text-gray-600">
                Created on {new Date(championship.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-4">
              <Link to="/dashboard">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
              
              {!championship.completed && (
                <Button
                  className="bg-championship-primary hover:bg-championship-secondary"
                  onClick={handleSimulateAll}
                  disabled={isSimulating}
                >
                  {isSimulating ? "Simulating..." : "Simulate All"}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Tournament Bracket */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-6 text-center">Tournament Bracket</h2>
          <TournamentBracket
            championship={championship}
            onSimulateMatch={!championship.completed ? handleSimulateMatch : undefined}
          />
        </div>
        
        {/* Championship Information */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Teams List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Teams</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {championship.teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </div>
          
          {/* Championship Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Championship Status</h2>
            
            {championship.completed ? (
              <div>
                <div className="bg-championship-light rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-championship-primary mb-4">Final Results</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-championship-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                        1
                      </div>
                      <div>
                        <span className="font-semibold">{championship.winner?.name}</span>
                        <span className="text-sm text-gray-500 block">Champion</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-championship-secondary text-white rounded-full flex items-center justify-center font-bold mr-3">
                        2
                      </div>
                      <div>
                        <span className="font-semibold">{championship.runnerUp?.name}</span>
                        <span className="text-sm text-gray-500 block">Runner Up</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        3
                      </div>
                      <div>
                        <span className="font-semibold">{championship.thirdPlace?.name}</span>
                        <span className="text-sm text-gray-500 block">Third Place</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        4
                      </div>
                      <div>
                        <span className="font-semibold">{championship.fourthPlace?.name}</span>
                        <span className="text-sm text-gray-500 block">Fourth Place</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Link to="/create-championship">
                  <Button className="w-full bg-championship-primary hover:bg-championship-secondary">
                    Create New Championship
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-6">
                  This championship is in progress. Simulate matches to continue the tournament.
                </p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Matches Played</span>
                    <span className="font-semibold">
                      {championship.matches.filter(m => m.played).length} / 7
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Round</span>
                    <span className="font-semibold">
                      {championship.matches.filter(m => m.round === 1 && m.played).length === 4
                        ? championship.matches.filter(m => m.round === 2 && m.played).length === 2
                          ? "Finals"
                          : "Semifinals"
                        : "Quarterfinals"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Next Action</span>
                    <span className="font-semibold text-championship-primary">
                      {championship.matches.filter(m => m.round === 1 && m.played).length < 4
                        ? "Simulate Quarterfinals"
                        : championship.matches.filter(m => m.round === 2 && m.played).length < 2
                        ? "Simulate Semifinals"
                        : "Simulate Finals"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button
                    className="w-full bg-championship-primary hover:bg-championship-secondary"
                    onClick={handleSimulateAll}
                    disabled={isSimulating}
                  >
                    {isSimulating ? "Simulating..." : "Simulate All Remaining Matches"}
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
