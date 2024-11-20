import React, { useState, useEffect, useRef } from 'react';
import { getPokemonData, getPokemonSuggestions, loadPokemonNames } from './services/pokemonService';
import PokemonCard from './components/PokemonCard';
import { CombinedPokemonData } from './types/pokemon';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonData, setPokemonData] = useState<CombinedPokemonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Load Pokemon names when the app starts
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Loading Pokemon names...');
        await loadPokemonNames();
        console.log('Pokemon names loaded successfully');
      } catch (error) {
        console.error('Error loading Pokemon names:', error);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Clear the previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if the term is empty
    if (searchTerm.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Set a new timeout to search after 300ms
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        console.log('Loading suggestions for:', searchTerm);
        const results = await getPokemonSuggestions(searchTerm);
        console.log('Suggestions loaded:', results);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error loading suggestions:', error);
      }
    }, 300);

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError(null);
    setPokemonData(null);
    setShowSuggestions(false);

    try {
      console.log('Searching for Pokemon:', searchTerm);
      const data = await getPokemonData(searchTerm);
      console.log('Pokemon data loaded:', data);
      setPokemonData(data);
    } catch (err) {
      console.error('Error fetching Pokemon:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon data');
      setPokemonData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleSearch({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokemon Viewer</h1>
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="input-container" ref={suggestionsRef}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                placeholder="Enter Pokemon name..."
                className="search-input"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="search-button">Search</button>
          </form>
        </div>
      </header>

      <main className="main-content">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {pokemonData && <PokemonCard pokemon={pokemonData} />}
      </main>
    </div>
  );
}

export default App;
