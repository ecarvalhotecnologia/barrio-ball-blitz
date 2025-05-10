
import React from "react";
import TeamCard from "@/components/TeamCard";
import { Team } from "@/utils/tournamentUtils";

interface TeamsListProps {
  teams: Team[];
}

const TeamsList = ({ teams }: TeamsListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Equipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
};

export default TeamsList;
