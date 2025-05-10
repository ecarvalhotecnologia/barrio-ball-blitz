
import { Match } from "@/utils/tournamentUtils";

interface MatchCardProps {
  match: Match;
  onSimulate?: () => void;
}

const MatchCard = ({ match, onSimulate }: MatchCardProps) => {
  // Check if match has teams assigned
  const hasTeams = match.team1?.id && match.team2?.id;
  
  // Determine round name
  const getRoundName = (round: number, matchNumber: number) => {
    switch (round) {
      case 1:
        return `Quarterfinal ${matchNumber}`;
      case 2:
        return `Semifinal ${matchNumber}`;
      case 3:
        return matchNumber === 1 ? "3rd Place" : "Final";
      default:
        return `Match ${matchNumber}`;
    }
  };
  
  // Determine if there's a winner
  const getWinnerClass = (teamId: string) => {
    if (!match.played) return "";
    if (match.winner?.id === teamId) return "text-championship-primary font-bold";
    return "text-gray-500";
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
              
              <div className={`text-lg font-semibold ${match.played ? "" : "text-gray-300"}`}>
                {match.played ? match.team1Goals : "-"}
              </div>
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
              
              <div className={`text-lg font-semibold ${match.played ? "" : "text-gray-300"}`}>
                {match.played ? match.team2Goals : "-"}
              </div>
            </div>
          </>
        ) : (
          <div className="py-6 text-center text-gray-500 text-sm italic">
            Awaiting teams
          </div>
        )}
      </div>
      
      {hasTeams && !match.played && onSimulate && (
        <div className="px-4 pb-4">
          <button
            onClick={onSimulate}
            className="w-full py-2 bg-championship-primary text-white rounded-md hover:bg-championship-secondary transition-colors text-sm font-medium"
          >
            Simulate Match
          </button>
        </div>
      )}
      
      {match.played && match.winner && (
        <div className="px-4 pb-4">
          <div className="text-center text-xs text-gray-500 mt-1">
            Winner: <span className="text-championship-primary font-medium">{match.winner.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
