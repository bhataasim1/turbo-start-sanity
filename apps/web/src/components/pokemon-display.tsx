import React from "react";
import type { Pokemon } from "@/lib/sanity/sanity.types";
import { POKEMON_TYPE_COLORS, type PokemonType } from "@/types/pokemon";

interface PokemonDisplayProps {
  pokemon: Pokemon;
  className?: string;
}

export const PokemonDisplay: React.FC<PokemonDisplayProps> = ({ 
  pokemon, 
  className = "" 
}) => {
  const getTypeColor = (type: PokemonType) => {
    return POKEMON_TYPE_COLORS[type] || "bg-gray-400";
  };

  const formatHeight = (height?: number) => {
    if (!height) return "Unknown";
    // Convert from decimeters to meters
    return `${(height / 10).toFixed(1)}m`;
  };

  const formatWeight = (weight?: number) => {
    if (!weight) return "Unknown";
    // Convert from hectograms to kilograms
    return `${(weight / 10).toFixed(1)}kg`;
  };

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 shadow-md border border-blue-200 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Featured Pokemon
        </h3>
        <div className="w-24 h-24 mx-auto bg-white rounded-full p-2 shadow-inner">
          <img
            src={pokemon.spriteUrl}
            alt={pokemon.name}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="text-center mb-4">
        <h4 className="text-xl font-bold text-gray-900 capitalize mb-2">
          {pokemon.name}
        </h4>
        <div className="flex justify-center gap-2 mb-3">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(type)}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-gray-600 font-medium">Height</div>
          <div className="text-gray-800 font-semibold">
            {formatHeight(pokemon.height)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-600 font-medium">Weight</div>
          <div className="text-gray-800 font-semibold">
            {formatWeight(pokemon.weight)}
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <div className="text-gray-600 text-xs">
          Pokemon ID: #{pokemon.id.toString().padStart(3, '0')}
        </div>
      </div>
    </div>
  );
};
