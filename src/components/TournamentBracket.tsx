
import { Championship } from "@/utils/tournamentUtils";
import MatchCard from "./MatchCard";

interface TournamentBracketProps {
  championship: Championship;
  onSimulateMatch?: (matchId: string) => void;
  onManualScore?: (matchId: string, team1Goals: number, team2Goals: number) => void;
}

const TournamentBracket = ({ championship, onSimulateMatch, onManualScore }: TournamentBracketProps) => {
  const { matches } = championship;
  
  // Get matches by round
  const quarterFinals = matches.filter(m => m.round === 1);
  const semiFinals = matches.filter(m => m.round === 2);
  const finalMatches = matches.filter(m => m.round === 3);
  
  // Sort final matches so the 3rd place match comes first
  finalMatches.sort((a, b) => a.matchNumber - b.matchNumber);
  
  return (
    <div className="tournament-bracket overflow-x-auto py-8 px-4">
      {/* Quarterfinals */}
      <div className="tournament-round">
        <h3 className="text-center font-semibold mb-4 text-gray-700">Quartas de Final</h3>
        <div className="space-y-6">
          {quarterFinals.map(match => (
            <div key={match.id} className="match-container">
              <MatchCard 
                match={match} 
                onSimulate={onSimulateMatch ? () => onSimulateMatch(match.id) : undefined} 
                onManualScore={onManualScore ? (team1Goals, team2Goals) => onManualScore(match.id, team1Goals, team2Goals) : undefined}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Semifinals */}
      <div className="tournament-round">
        <h3 className="text-center font-semibold mb-4 text-gray-700">Semifinais</h3>
        <div className="space-y-6 flex flex-col justify-center h-[calc(100%-40px)]">
          {semiFinals.map(match => (
            <div key={match.id} className="match-container">
              <MatchCard 
                match={match} 
                onSimulate={onSimulateMatch ? () => onSimulateMatch(match.id) : undefined}
                onManualScore={onManualScore ? (team1Goals, team2Goals) => onManualScore(match.id, team1Goals, team2Goals) : undefined}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Final & 3rd Place */}
      <div className="tournament-round">
        <h3 className="text-center font-semibold mb-4 text-gray-700">Finais</h3>
        <div className="space-y-6 flex flex-col justify-center h-[calc(100%-40px)]">
          {finalMatches.map(match => (
            <div key={match.id} className="match-container">
              <MatchCard 
                match={match} 
                onSimulate={onSimulateMatch ? () => onSimulateMatch(match.id) : undefined}
                onManualScore={onManualScore ? (team1Goals, team2Goals) => onManualScore(match.id, team1Goals, team2Goals) : undefined}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Championship Results */}
      {championship.completed && (
        <div className="tournament-round">
          <h3 className="text-center font-semibold mb-4 text-gray-700">Resultados</h3>
          <div className="bg-white shadow-md rounded-lg border border-gray-200 p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-lg font-bold text-championship-primary">
                <span>1º:</span>
                <span>{championship.winner?.name}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-base font-semibold text-gray-700">
                <span>2º:</span>
                <span>{championship.runnerUp?.name}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                <span>3º:</span>
                <span>{championship.thirdPlace?.name}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>4º:</span>
                <span>{championship.fourthPlace?.name}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentBracket;
