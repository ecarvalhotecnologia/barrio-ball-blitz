
import { Team } from "@/utils/tournamentUtils";

interface TeamCardProps {
  team: Team;
  onRemove?: () => void;
}

const TeamCard = ({ team, onRemove }: TeamCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-4 flex items-center space-x-4">
        <div className="w-12 h-12 bg-championship-light rounded-full flex items-center justify-center">
          {team.logo ? (
            <img 
              src={team.logo} 
              alt={`${team.name} logo`} 
              className="w-10 h-10 object-contain rounded-full"
            />
          ) : (
            <div className="text-lg font-bold text-championship-primary">
              {team.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{team.name}</h3>
          <p className="text-xs text-gray-500">Registration #{team.registrationOrder}</p>
        </div>
        
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
            aria-label="Remove team"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
