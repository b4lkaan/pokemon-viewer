import { CombinedPokemonData, GenerationData, PokeAPIPokemon } from '../types/pokemon';

const GENERATIONS = Array.from({ length: 9 }, (_, i) => i + 1).reverse();
const BASE_API_URL = 'https://pokeapi.co/api/v2';
const BASE_PUBLIC_URL = process.env.PUBLIC_URL || '';

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

// Cache for Pokemon names
let pokemonNamesCache: string[] | null = null;

// Function to load all Pokemon names into cache
export async function loadPokemonNames(): Promise<string[]> {
  if (pokemonNamesCache !== null) {
    return pokemonNamesCache;
  }

  const allNames = new Set<string>();

  for (const gen of GENERATIONS) {
    try {
      const dataPath = `${BASE_PUBLIC_URL}/data/gen${gen}.json`;
      const response = await fetch(dataPath);
      
      if (!response.ok) {
        console.error(`Failed to load gen${gen}.json - Status: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      Object.keys(data).forEach(name => allNames.add(name));
      
    } catch (error) {
      console.error(`Error loading gen${gen}.json:`, error);
    }
  }

  pokemonNamesCache = Array.from(allNames).sort();
  return pokemonNamesCache;
}

// Function to get suggestions from cache
export async function getPokemonSuggestions(input: string): Promise<string[]> {
  const formattedInput = input.toLowerCase();
  
  // Ensure names are loaded
  const allNames = await loadPokemonNames();
  
  // Filter names that start with the input
  return allNames.filter(name => 
    name.toLowerCase().startsWith(formattedInput)
  );
}

export async function fetchPokemonFromAPI(pokemonName: string): Promise<PokeAPIPokemon> {
  const response = await fetch(`${BASE_API_URL}/pokemon/${pokemonName.toLowerCase()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon: ${pokemonName}`);
  }
  return response.json();
}

export async function searchPokemonInLocalFiles(pokemonName: string): Promise<{ generation: number; data: any } | null> {
  const searchName = pokemonName.toLowerCase();
  console.log('Searching for Pokemon with name:', searchName);
  
  for (const gen of GENERATIONS) {
    try {
      const dataPath = `${BASE_PUBLIC_URL}/data/gen${gen}.json`;
      console.log(`Attempting to load data from: ${dataPath}`);
      
      const response = await fetch(dataPath);
      if (!response.ok) {
        console.error(`Failed to load gen${gen}.json - Status: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`Successfully loaded gen${gen}.json`);
      
      // Find the Pokemon name case-insensitively
      const pokemonKey = Object.keys(data).find(key => key.toLowerCase() === searchName);
      
      if (pokemonKey) {
        console.log(`Found ${pokemonKey} in gen${gen}.json`);
        console.log('Pokemon data:', data[pokemonKey]);
        return {
          generation: gen,
          data: data[pokemonKey]
        };
      }
      
      // Check for variant names case-insensitively
      const variantKey = Object.keys(data).find(key => 
        key.toLowerCase().startsWith(searchName + '-')
      );
      
      if (variantKey) {
        console.log(`Found variant ${variantKey} in gen${gen}.json`);
        console.log('Pokemon variant data:', data[variantKey]);
        return {
          generation: gen,
          data: data[variantKey]
        };
      }
      
      console.log(`${searchName} not found in gen${gen}.json`);
    } catch (error) {
      console.error(`Error loading gen${gen}.json:`, error);
    }
  }
  
  console.log('Pokemon not found in any generation file');
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
    console.log('Fetching data for Pokemon:', pokemonName);
    
    // Fetch data from PokeAPI
    const apiData = await fetchPokemonFromAPI(pokemonName);
    console.log('API data fetched successfully');
    
    // Search in local files
    const localData = await searchPokemonInLocalFiles(pokemonName);
    if (!localData) {
      console.error('No local data found for Pokemon:', pokemonName);
    } else {
      console.log('Local data found:', localData);
    }
    
    // Extract types from API data
    const types = apiData.types.map(t => t.type.name);
    
    // Calculate type effectiveness
    const { weaknesses, strengths } = calculateTypeEffectiveness(types);
    
    // Create the combined data object
    const combinedData: CombinedPokemonData = {
      apiData,
      setData: localData?.data || {},
      weaknesses,
      strengths
    };
    
    console.log('Combined data:', combinedData);
    return combinedData;
  } catch (error) {
    console.error('Error in getPokemonData:', error);
    throw error;
  }
}
