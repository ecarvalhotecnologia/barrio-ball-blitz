
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Championship } from "@/utils/tournamentUtils";

interface ChampionshipHeaderProps {
  championship: Championship;
  isSimulating: boolean;
  onSimulateAll: () => void;
}

const ChampionshipHeader = ({ championship, isSimulating, onSimulateAll }: ChampionshipHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">{championship.name}</h1>
            {championship.completed && (
              <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Concluído
              </span>
            )}
          </div>
          <p className="text-gray-600">
            Criado em {new Date(championship.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex gap-4">
          <Link to="/dashboard">
            <Button variant="outline">
              Voltar ao Painel
            </Button>
          </Link>
          
          {!championship.completed && (
            <Button
              className="bg-championship-primary hover:bg-championship-secondary"
              onClick={onSimulateAll}
              disabled={isSimulating}
            >
              {isSimulating ? "Simulando..." : "Simular Todos"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChampionshipHeader;
