import React, { useState } from 'react';
import { CombinedPokemonData, PokemonSet } from '../types/pokemon';
import TypeBadge from './TypeBadge';
import './PokemonCard.css';

interface PokemonCardProps {
  data: CombinedPokemonData;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ data }) => {
  const { apiData, setData, weaknesses, strengths } = data;
  const [selectedTier, setSelectedTier] = useState<string>(Object.keys(setData)[0]);
  const [selectedSet, setSelectedSet] = useState<string>(
    Object.keys(setData[selectedTier])[0]
  );

  const currentSet: PokemonSet = setData[selectedTier][selectedSet];

  const formatMoveset = (moves: (string | string[])[]) => {
    return moves.map((move) => {
      if (Array.isArray(move)) {
        return move.join(' / ');
      }
      return move;
    });
  };

  return (
    <div className="pokemon-card">
      <div className="pokemon-header">
        <img
          src={apiData.sprites.other['official-artwork'].front_default}
          alt={apiData.name}
          className="pokemon-image"
        />
        <div className="pokemon-info">
          <h2 className="pokemon-name">
            {apiData.name.charAt(0).toUpperCase() + apiData.name.slice(1)}
          </h2>
          <div className="pokemon-number">#{apiData.id.toString().padStart(3, '0')}</div>
          <div className="pokemon-types">
            {apiData.types.map((type) => (
              <TypeBadge key={type.type.name} type={type.type.name} />
            ))}
          </div>
        </div>
      </div>

      <div className="pokemon-details">
        <div className="section">
          <h3>Abilities</h3>
          <div className="abilities-list">
            {apiData.abilities.map((ability) => (
              <div key={ability.ability.name} className="ability">
                {ability.ability.name.replace('-', ' ')}
                {ability.is_hidden && <span className="hidden-ability">(Hidden)</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Type Effectiveness</h3>
          <div className="type-effectiveness">
            <div className="weaknesses">
              <h4>Weaknesses</h4>
              <div className="type-list">
                {Object.entries(weaknesses).map(([type, value]) => (
                  <TypeBadge key={type} type={type} effectiveness={value} />
                ))}
              </div>
            </div>
            <div className="resistances">
              <h4>Resistances</h4>
              <div className="type-list">
                {Object.entries(strengths).map(([type, value]) => (
                  <TypeBadge key={type} type={type} effectiveness={value} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Sets</h3>
          <div className="set-selector">
            <select
              value={selectedTier}
              onChange={(e) => {
                setSelectedTier(e.target.value);
                setSelectedSet(Object.keys(setData[e.target.value])[0]);
              }}
            >
              {Object.keys(setData).map((tier) => (
                <option key={tier} value={tier}>
                  {tier.toUpperCase()}
                </option>
              ))}
            </select>
            <select
              value={selectedSet}
              onChange={(e) => setSelectedSet(e.target.value)}
            >
              {Object.keys(setData[selectedTier]).map((set) => (
                <option key={set} value={set}>
                  {set}
                </option>
              ))}
            </select>
          </div>

          <div className="set-details">
            <div className="moves">
              <h4>Moves</h4>
              <ul>
                {formatMoveset(currentSet.moves).map((move, index) => (
                  <li key={index}>{move}</li>
                ))}
              </ul>
            </div>

            <div className="build-info">
              <div className="info-group">
                <h4>Item</h4>
                <p>{Array.isArray(currentSet.item) ? currentSet.item.join(' / ') : currentSet.item}</p>
              </div>

              <div className="info-group">
                <h4>Ability</h4>
                <p>{currentSet.ability || 'Any'}</p>
              </div>

              <div className="info-group">
                <h4>Nature</h4>
                <p>{Array.isArray(currentSet.nature) ? currentSet.nature.join(' / ') : currentSet.nature}</p>
              </div>

              {currentSet.evs && (
                <div className="info-group">
                  <h4>EV Spread</h4>
                  <div className="ev-spread">
                    {Object.entries(
                      Array.isArray(currentSet.evs) ? currentSet.evs[0] : currentSet.evs
                    ).map(([stat, value]) => (
                      <div key={stat} className="ev-stat">
                        <span className="stat-name">{stat}</span>
                        <span className="stat-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentSet.teratypes && (
                <div className="info-group">
                  <h4>Tera Types</h4>
                  <div className="tera-types">
                    {(Array.isArray(currentSet.teratypes)
                      ? currentSet.teratypes
                      : [currentSet.teratypes]
                    ).map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
