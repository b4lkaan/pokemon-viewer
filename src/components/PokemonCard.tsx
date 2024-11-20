import React, { useState } from 'react';
import { CombinedPokemonData } from '../types/pokemon';
import './PokemonCard.css';

export interface PokemonCardProps {
  pokemon: CombinedPokemonData;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [selectedTier, setSelectedTier] = useState<string>(Object.keys(pokemon.setData)[0] || '');
  const tiers = Object.keys(pokemon.setData);
  
  const renderSetDetails = (tier: string, setName: string) => {
    const set = pokemon.setData[tier][setName];
    return (
      <div className="set-details" key={setName}>
        <h4 className="set-name">{setName}</h4>
        {set.ability && (
          <div className="set-ability">
            <span className="label">Ability:</span>
            <span className="value">{Array.isArray(set.ability) ? set.ability.join(' / ') : set.ability}</span>
          </div>
        )}
        {set.teratypes && (
          <div className="set-teratype">
            <span className="label">Tera Type:</span>
            <span className="value">
              {Array.isArray(set.teratypes) ? set.teratypes.join(' / ') : set.teratypes}
            </span>
          </div>
        )}
        <div className="set-moves">
          <span className="label">Moves:</span>
          <ul>
            {set.moves.map((move, index) => (
              <li key={index} className="move-item">
                {Array.isArray(move) ? move.join(' / ') : move}
              </li>
            ))}
          </ul>
        </div>
        {set.item && (
          <div className="set-item">
            <span className="label">Item:</span>
            <span className="value">
              {Array.isArray(set.item) ? set.item.join(' / ') : set.item}
            </span>
          </div>
        )}
        {set.nature && (
          <div className="set-nature">
            <span className="label">Nature:</span>
            <span className="value">
              {Array.isArray(set.nature) ? set.nature.join(' / ') : set.nature}
            </span>
          </div>
        )}
        {set.evs && (
          <div className="set-evs">
            <span className="label">EVs:</span>
            <ul>
              {Object.entries(Array.isArray(set.evs) ? set.evs[0] : set.evs)
                .filter(([_, value]) => value > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([stat, value]) => (
                  <li key={stat} className="ev-item">
                    {`${value} ${stat.toUpperCase()}`}
                  </li>
                ))}
            </ul>
          </div>
        )}
        {set.ivs && Object.values(set.ivs).some(iv => iv !== 31) && (
          <div className="set-ivs">
            <span className="label">IVs:</span>
            <ul>
              {Object.entries(set.ivs)
                .filter(([_, value]) => value !== 31)
                .map(([stat, value]) => (
                  <li key={stat} className="iv-item">
                    {`${value} ${stat.toUpperCase()}`}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pokemon-card">
      <div className="pokemon-header">
        <img
          src={pokemon.apiData.sprites.other['official-artwork'].front_default}
          alt={pokemon.apiData.name}
          className="pokemon-sprite"
        />
        <h2 className="pokemon-name">
          {pokemon.apiData.name.charAt(0).toUpperCase() + pokemon.apiData.name.slice(1)}
        </h2>
      </div>

      <div className="pokemon-details">
        <div className="pokemon-types">
          <h3>Types:</h3>
          <div className="type-list">
            {pokemon.apiData.types.map((typeInfo) => (
              <span key={typeInfo.slot} className={`type-badge ${typeInfo.type.name}`}>
                {typeInfo.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="pokemon-abilities">
          <h3>Abilities:</h3>
          <ul>
            {pokemon.apiData.abilities.map((ability) => (
              <li key={ability.slot}>
                {ability.ability.name.replace('-', ' ')}
                {ability.is_hidden && <span className="hidden-ability"> (Hidden)</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="type-effectiveness">
          <h3>Type Effectiveness:</h3>
          <div className="type-matchups">
            <div className="weaknesses">
              <h4>Weaknesses:</h4>
              <ul>
                {Object.entries(pokemon.weaknesses)
                  .filter(([_, value]) => value > 1)
                  .map(([type, value]) => (
                    <li key={type} className={`type-badge ${type}`}>
                      {type}: {value}x
                    </li>
                  ))}
              </ul>
            </div>
            <div className="resistances">
              <h4>Resistances:</h4>
              <ul>
                {Object.entries(pokemon.weaknesses)
                  .filter(([_, value]) => value < 1)
                  .map(([type, value]) => (
                    <li key={type} className={`type-badge ${type}`}>
                      {type}: {value}x
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {tiers.length > 0 && (
          <div className="competitive-sets">
            <h3>Competitive Sets:</h3>
            <div className="tier-selector">
              <label htmlFor="tier-select">Select Tier:</label>
              <select
                id="tier-select"
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
              >
                {tiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>
            {selectedTier && (
              <div className="tier-sets">
                {Object.keys(pokemon.setData[selectedTier]).map((setName) => (
                  renderSetDetails(selectedTier, setName)
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
