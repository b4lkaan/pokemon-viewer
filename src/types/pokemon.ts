export interface PokemonSet {
  moves: (string | string[])[];
  ability?: string;
  item: string | string[];
  nature: string | string[];
  ivs?: Record<string, number>;
  evs: Record<string, number> | Record<string, number>[];
  teratypes?: string | string[];
}

export interface TierSets {
  [setName: string]: PokemonSet;
}

export interface PokemonData {
  [tier: string]: TierSets;
}

export interface GenerationData {
  [pokemonName: string]: PokemonData;
}

export interface PokeAPIType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokeAPISprites {
  front_default: string;
  other: {
    'official-artwork': {
      front_default: string;
    };
  };
}

export interface PokeAPIAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokeAPIPokemon {
  id: number;
  name: string;
  types: PokeAPIType[];
  sprites: PokeAPISprites;
  abilities: PokeAPIAbility[];
}

export interface CombinedPokemonData {
  apiData: PokeAPIPokemon;
  setData: PokemonData;
  weaknesses: Record<string, number>;
  strengths: Record<string, number>;
}
