
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamCard from "@/components/TeamCard";
import { createChampionship, saveChampionship, Team } from "@/utils/tournamentUtils";

const CreateChampionship = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [championshipName, setChampionshipName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Not authorized",
        description: "Please log in to create a championship",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);
  
  const handleAddTeam = () => {
    if (!teamName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a team name",
        variant: "destructive",
      });
      return;
    }
    
    if (teams.length >= 8) {
      toast({
        title: "Error",
        description: "Maximum 8 teams allowed",
        variant: "destructive",
      });
      return;
    }
    
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: teamName.trim(),
      createdAt: new Date().toISOString(),
      registrationOrder: teams.length + 1,
    };
    
    setTeams([...teams, newTeam]);
    setTeamName("");
  };
  
  const handleRemoveTeam = (teamId: string) => {
    const updatedTeams = teams.filter(team => team.id !== teamId);
    // Update registration order after removal
    const reorderedTeams = updatedTeams.map((team, index) => ({
      ...team,
      registrationOrder: index + 1,
    }));
    setTeams(reorderedTeams);
  };
  
  const handleCreateChampionship = () => {
    if (!championshipName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a championship name",
        variant: "destructive",
      });
      return;
    }
    
    if (teams.length !== 8) {
      toast({
        title: "Error",
        description: "You must have exactly 8 teams",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Create championship
      const championship = createChampionship(championshipName, teams);
      
      // Save to local storage
      saveChampionship(championship);
      
      toast({
        title: "Success",
        description: "Championship created successfully",
      });
      
      // Navigate to the championship view
      navigate(`/championship/${championship.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create championship",
        variant: "destructive",
      });
      setIsCreating(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create a New Championship</h1>
          <p className="text-gray-600">
            Set up your neighborhood soccer tournament with 8 teams.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Championship Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Championship Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="championshipName">Championship Name</Label>
                <Input
                  id="championshipName"
                  value={championshipName}
                  onChange={(e) => setChampionshipName(e.target.value)}
                  placeholder="Enter championship name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="teamName">Add Team</Label>
                <div className="flex mt-1">
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                    className="rounded-r-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTeam();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTeam}
                    className="rounded-l-none bg-championship-primary hover:bg-championship-secondary"
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Teams {teams.length}/8</Label>
                  <span className="text-sm text-gray-500">
                    You need exactly 8 teams
                  </span>
                </div>
                
                <div className="space-y-3">
                  {teams.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-md bg-gray-50">
                      <p className="text-gray-500">No teams added yet</p>
                      <p className="text-sm text-gray-400">Add 8 teams to continue</p>
                    </div>
                  ) : (
                    teams.map((team) => (
                      <TeamCard
                        key={team.id}
                        team={team}
                        onRemove={() => handleRemoveTeam(team.id)}
                      />
                    ))
                  )}
                </div>
              </div>
              
              <Button
                className="w-full bg-championship-primary hover:bg-championship-secondary"
                disabled={teams.length !== 8 || !championshipName || isCreating}
                onClick={handleCreateChampionship}
              >
                {isCreating ? "Creating..." : "Create Championship"}
              </Button>
            </div>
          </div>
          
          {/* Instructions and Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Championship Format</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Your championship will follow a knockout format:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>8 teams compete in single-elimination matches</li>
                  <li>Quarterfinals → Semifinals → Finals</li>
                  <li>3rd place match for semifinal losers</li>
                  <li>
                    In case of ties, the winner is determined by:
                    <ol className="list-decimal pl-5 mt-1 space-y-1 text-gray-600">
                      <li>Total points (goals scored minus goals conceded)</li>
                      <li>Registration order (first registered team wins)</li>
                    </ol>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-championship-light rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-championship-primary">Tips</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-championship-primary rounded-full text-white flex items-center justify-center mr-2 flex-shrink-0 text-xs">✓</span>
                  <span>Make sure to add exactly 8 teams</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-championship-primary rounded-full text-white flex items-center justify-center mr-2 flex-shrink-0 text-xs">✓</span>
                  <span>Team registration order matters in case of tiebreakers</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-championship-primary rounded-full text-white flex items-center justify-center mr-2 flex-shrink-0 text-xs">✓</span>
                  <span>You can simulate all matches or play the tournament step by step</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateChampionship;
