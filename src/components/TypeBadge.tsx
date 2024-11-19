import React from 'react';
import './TypeBadge.css';

interface TypeBadgeProps {
  type: string;
  effectiveness?: number;
}

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
};

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, effectiveness }) => {
  const backgroundColor = TYPE_COLORS[type.toLowerCase()] || '#777';
  
  return (
    <div 
      className="type-badge"
      style={{ backgroundColor }}
    >
      <span className="type-name">{type}</span>
      {effectiveness && (
        <span className="type-effectiveness">
          {effectiveness > 1 ? `${effectiveness}×` : `${effectiveness}×`}
        </span>
      )}
    </div>
  );
};

export default TypeBadge;
