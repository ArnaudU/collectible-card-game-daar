import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { CardProps } from './Card';


const API_PORT = import.meta.env.API_PORT;

const Album: React.FC<{}> = () => {
  const [cards, setCards] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fonction pour récupérer les cartes détenues par le propriétaire
  const fetchAllCards = async () => {
    try {
      const response = await axios.get(`http://localhost:${API_PORT}/api/cards/getInfo`);
      const cards: CardProps[] = response.data;
      setCards(cards);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des cartes :', error);
      setLoading(false);
    }
  };

  // Charger les cartes à partir de la blockchain
  useEffect(() => {
    fetchAllCards();
  }, []);

  // Affichage des cartes
  if (loading) {
    return <p>Chargement des cartes...</p>;
  }

  return (
    <div>
      <h1>Album</h1>
      {cards.length > 0 ? (
        <ul>
          {cards.map((card) => (
            <li key={card.id}>Carte ID: {card.id}</li>
          ))}
        </ul>
      ) : (
        <p>Vous ne possédez aucune carte.</p>
      )}
    </div>
  );
};

export default Album;
