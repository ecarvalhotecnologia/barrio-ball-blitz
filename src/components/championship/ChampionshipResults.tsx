
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Championship } from "@/utils/tournamentUtils";

interface ChampionshipResultsProps {
  championship: Championship;
  isSimulating: boolean;
  onSimulateAll: () => void;
}

const ChampionshipResults = ({ championship, isSimulating, onSimulateAll }: ChampionshipResultsProps) => {
  return (
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
              onClick={onSimulateAll}
              disabled={isSimulating}
            >
              {isSimulating ? "Simulando..." : "Simular Todas as Partidas Restantes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChampionshipResults;
