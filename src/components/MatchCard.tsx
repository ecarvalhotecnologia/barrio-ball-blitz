
import { useState } from "react";
import { Match } from "@/utils/tournamentUtils";
import { Input } from "@/components/ui/input";

interface MatchCardProps {
  match: Match;
  onSimulate?: () => void;
  onManualScore?: (team1Goals: number, team2Goals: number) => void;
}

const MatchCard = ({ match, onSimulate, onManualScore }: MatchCardProps) => {
  // Check if match has teams assigned
  const hasTeams = match.team1?.id && match.team2?.id;
  
  // Estado para os placares manuais
  const [team1Score, setTeam1Score] = useState<number | "">("");
  const [team2Score, setTeam2Score] = useState<number | "">("");
  const [manualMode, setManualMode] = useState(false);
  
  // Determine round name
  const getRoundName = (round: number, matchNumber: number) => {
    switch (round) {
      case 1:
        return `Quartas de Final ${matchNumber}`;
      case 2:
        return `Semifinal ${matchNumber}`;
      case 3:
        return matchNumber === 1 ? "Disputa 3º Lugar" : "Final";
      default:
        return `Partida ${matchNumber}`;
    }
  };
  
  // Determine if there's a winner
  const getWinnerClass = (teamId: string) => {
    if (!match.played) return "";
    if (match.winner?.id === teamId) return "text-championship-primary font-bold";
    return "text-gray-500";
  };
  
  const handleSubmitManualScore = () => {
    if (team1Score !== "" && team2Score !== "" && onManualScore) {
      onManualScore(Number(team1Score), Number(team2Score));
      setManualMode(false);
      setTeam1Score("");
      setTeam2Score("");
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border overflow-hidden 
      ${match.played ? "border-gray-200" : "border-gray-200 hover:border-championship-primary"} 
      transition-all`}>
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">
          {getRoundName(match.round, match.matchNumber)}
        </h3>
      </div>
      
      <div className="p-4 space-y-3">
        {hasTeams ? (
          <>
            <div className="flex justify-between items-center">
              <div className={`flex items-center space-x-2 ${getWinnerClass(match.team1.id)}`}>
                <div className="w-8 h-8 bg-championship-light rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {match.team1.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm">{match.team1.name}</span>
              </div>
              
              {manualMode ? (
                <Input
                  type="number"
                  min="0"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-12 text-center"
                />
              ) : (
                <div className={`text-lg font-semibold ${match.played ? "" : "text-gray-300"}`}>
                  {match.played ? match.team1Goals : "-"}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className={`flex items-center space-x-2 ${getWinnerClass(match.team2.id)}`}>
                <div className="w-8 h-8 bg-championship-light rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {match.team2.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm">{match.team2.name}</span>
              </div>
              
              {manualMode ? (
                <Input
                  type="number"
                  min="0"
                  value={team2Score}
                  onChange={(e) => setTeam2Score(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-12 text-center"
                />
              ) : (
                <div className={`text-lg font-semibold ${match.played ? "" : "text-gray-300"}`}>
                  {match.played ? match.team2Goals : "-"}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-6 text-center text-gray-500 text-sm italic">
            Aguardando equipes
          </div>
        )}
      </div>
      
      {hasTeams && !match.played && (
        <div className="px-4 pb-4 space-y-2">
          {!manualMode && onSimulate && (
            <button
              onClick={onSimulate}
              className="w-full py-2 bg-championship-primary text-white rounded-md hover:bg-championship-secondary transition-colors text-sm font-medium"
            >
              Simular Partida
            </button>
          )}
          
          {!manualMode && onManualScore && (
            <button
              onClick={() => setManualMode(true)}
              className="w-full py-2 border border-championship-primary text-championship-primary rounded-md hover:bg-championship-light transition-colors text-sm font-medium"
            >
              Inserir Placar Manualmente
            </button>
          )}
          
          {manualMode && (
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleSubmitManualScore}
                className="w-full py-2 bg-championship-primary text-white rounded-md hover:bg-championship-secondary transition-colors text-sm font-medium"
                disabled={team1Score === "" || team2Score === ""}
              >
                Confirmar Placar
              </button>
              <button
                onClick={() => {
                  setManualMode(false);
                  setTeam1Score("");
                  setTeam2Score("");
                }}
                className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}
      
      {match.played && match.winner && (
        <div className="px-4 pb-4">
          <div className="text-center text-xs text-gray-500 mt-1">
            Vencedor: <span className="text-championship-primary font-medium">{match.winner.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
