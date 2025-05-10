
import React from "react";
import TournamentBracket from "@/components/TournamentBracket";
import { Championship } from "@/utils/tournamentUtils";

interface TournamentContainerProps {
  championship: Championship;
  onSimulateMatch?: (matchId: string) => void;
  onManualScore?: (matchId: string, team1Goals: number, team2Goals: number) => void;
}

const TournamentContainer = ({ championship, onSimulateMatch, onManualScore }: TournamentContainerProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-6 text-center">Chaves do Torneio</h2>
      <TournamentBracket
        championship={championship}
        onSimulateMatch={!championship.completed ? onSimulateMatch : undefined}
        onManualScore={!championship.completed ? onManualScore : undefined}
      />
    </div>
  );
};

export default TournamentContainer;
