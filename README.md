# Pokémon Viewer

A modern web application for viewing detailed Pokémon information, including competitive sets and battle strategies. Built with React and TypeScript, this application combines data from the PokéAPI and custom competitive sets to provide a comprehensive Pokémon information viewer.

## Features

### 1. Pokémon Search
- Real-time search functionality with auto-suggestions
- Search by Pokémon name with support for variants and forms
- Instant results as you type

### 2. Pokémon Information Display
- **Basic Information**
  - Official artwork display
  - Pokémon name and types
  - Base abilities
  - Type effectiveness calculations
  
- **Competitive Information**
  - Multiple competitive tiers (OU, UU, RU, etc.)
  - Detailed move sets for each tier
  - Recommended abilities, items, and natures
  - EV and IV spreads
  - Tera Type recommendations
  - Alternative move options

### 3. User Interface
- Clean and modern dark theme
- Responsive design for all screen sizes
- Interactive elements with hover effects
- Organized layout for easy information scanning
- Mobile-friendly interface

## Technical Architecture

### Components

1. **App Component** (`src/App.tsx`)
   - Main application container
   - Handles routing and layout

2. **PokemonCard Component** (`src/components/PokemonCard.tsx`)
   - Displays detailed Pokémon information
   - Manages competitive set display
   - Handles tier selection
   - Responsive layout implementation

3. **SearchBar Component** (`src/components/SearchBar.tsx`)
   - Manages search functionality
   - Provides auto-completion
   - Handles user input

### Services

1. **Pokemon Service** (`src/services/pokemonService.ts`)
   - Handles API calls to PokéAPI
   - Manages local JSON data fetching
   - Combines data from multiple sources
   - Implements caching for performance

### Data Management

1. **API Integration**
   - Utilizes PokéAPI for basic Pokémon data
   - Custom JSON files for competitive sets
   - Efficient data fetching and caching

2. **Local Data** (`public/data/`)
   - Competitive sets stored in generation-specific JSON files
   - Organized by Pokémon name and competitive tier
   - Includes detailed move sets and strategies

### Types and Interfaces (`src/types/pokemon.ts`)
```typescript
interface PokemonSet {
  moves: (string | string[])[];
  ability?: string;
  item: string | string[];
  nature: string | string[];
  ivs?: Record<string, number>;
  evs: Record<string, number> | Record<string, number>[];
  teratypes?: string | string[];
}

interface CombinedPokemonData {
  apiData: PokeAPIPokemon;
  setData: PokemonData;
  weaknesses: Record<string, number>;
  strengths: Record<string, number>;
}
```

## Setup and Installation

1. **Prerequisites**
   - Node.js (v14 or higher)
   - npm or yarn

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]

   # Install dependencies
   cd pokemon-viewer
   npm install
   ```

3. **Running the Application**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

4. **Building for Production**
   ```bash
   npm run build
   ```

## Project Structure
```
pokemon-viewer/
├── public/
│   ├── data/           # Competitive set JSON files
│   │   ├── gen1.json
│   │   ├── gen2.json
│   │   └── ...
│   └── index.html
├── src/
│   ├── components/     # React components
│   │   ├── PokemonCard.tsx
│   │   ├── PokemonCard.css
│   │   └── SearchBar.tsx
│   ├── services/      # API and data services
│   │   └── pokemonService.ts
│   ├── types/         # TypeScript type definitions
│   │   └── pokemon.ts
│   ├── App.tsx        # Main application component
│   └── index.tsx      # Application entry point
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Future Enhancements

1. **Team Builder**
   - Save and manage Pokémon teams
   - Team analysis and type coverage

2. **Battle Simulator Integration**
   - Connect with Pokémon Showdown
   - Direct team export

3. **Advanced Search**
   - Filter by type, ability, or stats
   - Search by competitive viability

4. **User Accounts**
   - Save favorite Pokémon
   - Create and share custom sets

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- PokéAPI for providing comprehensive Pokémon data
- Smogon for competitive Pokémon information
- React team for the amazing framework
- The Pokémon community for inspiration and support
