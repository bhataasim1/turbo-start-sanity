import React, { useCallback, useEffect, useState } from "react";
import { set, unset } from "sanity";
import { Button, Card, Flex, Inline, Stack, Text, TextInput } from "@sanity/ui";
import { Search, X, Loader2 } from "lucide-react";

interface Pokemon {
  id: number;
  name: string;
  types: Array<
    | "normal"
    | "fire"
    | "water"
    | "electric"
    | "grass"
    | "ice"
    | "fighting"
    | "poison"
    | "ground"
    | "flying"
    | "psychic"
    | "bug"
    | "rock"
    | "ghost"
    | "dragon"
    | "dark"
    | "steel"
    | "fairy"
  >;
  spriteUrl: string;
  height?: number;
  weight?: number;
}

interface PokemonFieldComponentProps {
  value?: Pokemon;
  onChange: (patch: any) => void;
  type: any;
}

interface PokeApiResponse {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites: { front_default: string };
  height: number;
  weight: number;
  abilities?: Array<{ ability: { name: string }; is_hidden: boolean; slot: number }>;
  base_experience?: number;
  stats?: Array<{ base_stat: number; effort: number; stat: { name: string } }>;
}

export const PokemonFieldComponent: React.FC<PokemonFieldComponentProps> = ({
  value,
  onChange,
  type,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search Pokemon when debounced term changes
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const searchPokemon = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${debouncedSearchTerm.toLowerCase()}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setSearchResults([]);
            setError("No Pokemon found with that name");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return;
        }

        const data: PokeApiResponse = await response.json();

        console.log("PokeAPI Response:", data);
        
        // Map API types to our schema types, filtering out any that don't match
        const validTypes = data.types
          .map(t => t.type.name)
          .filter((type): type is Pokemon["types"][number] => 
            ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"].includes(type)
          );

        const pokemon: Pokemon = {
          id: data.id,
          name: data.name,
          types: validTypes.length > 0 ? validTypes : ["normal"], // fallback to normal if no valid types
          spriteUrl: data.sprites.front_default,
          height: data.height,
          weight: data.weight,
        };

        console.log("Processed Pokemon object:", pokemon);
        setSearchResults([pokemon]);
        setError(null);
      } catch (err) {
        console.error("Error fetching Pokemon:", err);
        setError("Failed to fetch Pokemon data");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchPokemon();
  }, [debouncedSearchTerm]);

  const handleSelectPokemon = useCallback((pokemon: Pokemon) => {
    console.log("Selecting Pokemon:", pokemon);
    console.log("Calling onChange with set(pokemon)");
    
    setIsSaving(true);
    setError(null);
    
    try {
      onChange(set(pokemon));
      console.log("Pokemon saved successfully");
      setSearchTerm("");
      setSearchResults([]);
      setError(null);
    } catch (error) {
      console.error("Error saving Pokemon:", error);
      setError("Failed to save Pokemon data");
    } finally {
      setIsSaving(false);
    }
  }, [onChange]);

  const handleClearPokemon = useCallback(() => {
    onChange(unset());
    setSearchTerm("");
    setSearchResults([]);
    setError(null);
  }, [onChange]);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      normal: "bg-gray-400",
      fire: "bg-red-500",
      water: "bg-blue-500",
      electric: "bg-yellow-400",
      grass: "bg-green-500",
      ice: "bg-blue-300",
      fighting: "bg-red-700",
      poison: "bg-purple-500",
      ground: "bg-yellow-600",
      flying: "bg-indigo-400",
      psychic: "bg-pink-500",
      bug: "bg-green-400",
      rock: "bg-yellow-800",
      ghost: "bg-purple-700",
      dragon: "bg-indigo-700",
      dark: "bg-gray-800",
      steel: "bg-gray-500",
      fairy: "bg-pink-300",
    };
    return colors[type] || "bg-gray-400";
  };

  return (
    <Stack space={4}>
      <Stack space={3}>
        <Text size={2} weight="semibold">
          Pokemon Selection
        </Text>
        
        {/* Debug info */}
        <Text size={1} style={{ color: "#666", fontFamily: "monospace" }}>
          Current value: {value ? JSON.stringify(value, null, 2) : "None"}
        </Text>
        
        {!value && (
          <Stack space={3}>
            <Text size={1} style={{ color: "#666" }}>
              Search for a Pokemon by name (e.g., "pikachu", "charizard", "ditto")
            </Text>
            <Flex gap={2}>
              <TextInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                placeholder="Search for a Pokemon..."
                icon={Search}
                disabled={isLoading}
              />
              <Button
                mode="ghost"
                onClick={() => {
                  const testPokemon: Pokemon = {
                    id: 25,
                    name: "pikachu",
                    types: ["electric"],
                    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
                    height: 4,
                    weight: 60
                  };
                  handleSelectPokemon(testPokemon);
                }}
                disabled={isSaving}
              >
                Test: Add Pikachu
              </Button>
            </Flex>

            {isLoading && (
              <Flex align="center" gap={2}>
                <Loader2 className="h-4 w-4 animate-spin" />
                <Text size={1}>Searching...</Text>
              </Flex>
            )}

            {isSaving && (
              <Flex align="center" gap={2}>
                <Loader2 className="h-4 w-4 animate-spin" />
                <Text size={1}>Saving Pokemon...</Text>
              </Flex>
            )}

            {error && (
              <Text size={1} style={{ color: "red" }}>
                {error}
              </Text>
            )}

            {searchResults.length > 0 && (
              <Stack space={2}>
                {searchResults.map((pokemon) => (
                  <Card
                    key={pokemon.id}
                    padding={3}
                    radius={2}
                    shadow={1}
                    style={{ cursor: "pointer", border: "1px solid #3b82f6" }}
                    onClick={() => handleSelectPokemon(pokemon)}
                  >
                    <Flex align="center" gap={3}>
                      <img
                        src={pokemon.spriteUrl}
                        alt={pokemon.name}
                        style={{ width: "48px", height: "48px" }}
                      />
                      <Stack space={1}>
                        <Text size={2} weight="semibold">
                          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                        </Text>
                        <Inline space={1}>
                          {pokemon.types.map((type) => (
                            <span
                              key={type}
                              className={`px-2 py-1 rounded text-xs text-white font-medium ${getTypeColor(type)}`}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                          ))}
                        </Inline>
                      </Stack>
                    </Flex>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        )}

        {value && (
          <Card padding={3} radius={2} shadow={1} style={{ border: "2px solid #10b981" }}>
            <Stack space={3}>
              <Flex justify="space-between" align="center">
                <Text size={2} weight="semibold" style={{ color: "#10b981" }}>
                  ✅ Pokemon Selected Successfully!
                </Text>
                <Button
                  mode="ghost"
                  icon={X}
                  onClick={handleClearPokemon}
                  style={{ color: "#ef4444" }}
                />
              </Flex>
              
              <Flex align="center" gap={3}>
                <img
                  src={value.spriteUrl}
                  alt={value.name}
                  style={{ width: "64px", height: "64px" }}
                />
                <Stack space={2}>
                  <Text size={3} weight="semibold">
                    {value.name.charAt(0).toUpperCase() + value.name.slice(1)}
                  </Text>
                  <Inline space={1}>
                    {value.types.map((type) => (
                      <span
                        key={type}
                        className={`px-2 py-1 rounded text-xs text-white font-medium ${getTypeColor(type)}`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    ))}
                  </Inline>
                  <Text size={1} style={{ color: "#666" }}>
                    ID: {value.id} • Height: {value.height || "Unknown"}dm • Weight: {value.weight || "Unknown"}hg
                  </Text>
                </Stack>
              </Flex>
            </Stack>
          </Card>
        )}
      </Stack>
    </Stack>
  );
};
