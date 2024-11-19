import { CombinedPokemonData, GenerationData, PokeAPIPokemon } from '../types/pokemon';

const GENERATIONS = Array.from({ length: 9 }, (_, i) => i + 1).reverse();
const BASE_API_URL = 'https://pokeapi.co/api/v2';

const TYPE_EFFECTIVENESS = {
  normal: { ghost: 0, rock: 0.5, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

export async function fetchPokemonFromAPI(pokemonName: string): Promise<PokeAPIPokemon> {
  const response = await fetch(`${BASE_API_URL}/pokemon/${pokemonName.toLowerCase()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon: ${pokemonName}`);
  }
  return response.json();
}

export async function searchPokemonInLocalFiles(pokemonName: string): Promise<{ generation: number; data: any } | null> {
  // Capitalize the first letter and make the rest lowercase
  const formattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1).toLowerCase();
  
  for (const gen of GENERATIONS) {
    try {
      const response = await fetch(`/data/gen${gen}.json`);
      if (!response.ok) {
        console.error(`Failed to load gen${gen}.json`);
        continue;
      }
      
      const data: GenerationData = await response.json();
      
      // Check for exact match first
      if (data[formattedName]) {
        console.log(`Found ${formattedName} in gen${gen}.json`);
        return { generation: gen, data: data[formattedName] };
      }
      
      // Check for variant names (e.g., "Pokemon-Form")
      const variantKeys = Object.keys(data).filter(key => 
        key.toLowerCase().startsWith(formattedName.toLowerCase() + '-')
      );
      
      if (variantKeys.length > 0) {
        console.log(`Found variant ${variantKeys[0]} in gen${gen}.json`);
        // For now, return the first variant found
        // TODO: Add UI to let user choose which variant they want
        return { generation: gen, data: data[variantKeys[0]] };
      }
    } catch (error) {
      console.error(`Error loading gen${gen}.json:`, error);
    }
  }
  return null;
}

export function calculateTypeEffectiveness(types: string[]): { weaknesses: Record<string, number>; strengths: Record<string, number> } {
  const effectiveness: Record<string, number> = {};

  // Initialize effectiveness for all types
  Object.keys(TYPE_EFFECTIVENESS).forEach(type => {
    effectiveness[type] = 1;
  });

  // Calculate effectiveness considering all types
  types.forEach(defenderType => {
    Object.entries(TYPE_EFFECTIVENESS).forEach(([attackerType, relations]) => {
      const multiplier = relations[defenderType as keyof typeof relations] || 1;
      effectiveness[attackerType] *= multiplier;
    });
  });

  // Separate into weaknesses and strengths
  const weaknesses: Record<string, number> = {};
  const strengths: Record<string, number> = {};

  Object.entries(effectiveness).forEach(([type, value]) => {
    if (value > 1) {
      weaknesses[type] = value;
    } else if (value < 1) {
      strengths[type] = value;
    }
  });

  return { weaknesses, strengths };
}

export async function getPokemonData(pokemonName: string): Promise<CombinedPokemonData> {
  try {
    // Add logging to track the search process
    console.log(`Searching for Pokemon: ${pokemonName}`);
    
    const [apiData, localData] = await Promise.all([
      fetchPokemonFromAPI(pokemonName),
      searchPokemonInLocalFiles(pokemonName)
    ]);

    if (!localData) {
      throw new Error(`No local data found for Pokemon: ${pokemonName}`);
    }

    const types = apiData.types.map(t => t.type.name);
    const { weaknesses, strengths } = calculateTypeEffectiveness(types);

    return {
      apiData,
      setData: localData.data,
      weaknesses,
      strengths
    };
  } catch (error) {
    console.error('Error in getPokemonData:', error);
    throw error;
  }
}
