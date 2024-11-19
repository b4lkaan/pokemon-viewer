import React, { useState } from 'react';
import { getPokemonData } from './services/pokemonService';
import PokemonCard from './components/PokemonCard';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonData, setPokemonData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError(null);
    setPokemonData(null); // Clear the previous Pokemon data

    try {
      const data = await getPokemonData(searchTerm.toLowerCase());
      setPokemonData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon data');
      setPokemonData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokemon Viewer</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter Pokemon name..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </header>

      <main className="App-main">
        {error && <div className="error-message">{error}</div>}
        {pokemonData && <PokemonCard data={pokemonData} />}
      </main>
    </div>
  );
}

export default App;
