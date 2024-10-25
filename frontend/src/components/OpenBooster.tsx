import React, { useEffect, useState } from 'react';
import { CardProps } from './Card';
import axios from 'axios'

interface OpenBoosterProps {
  userAddress: string;
}

const API_PORT = import.meta.env.API_PORT;

const OpenBooster: React.FC<{userAddress: string}> = ({ userAddress }) => {
  const [cards, setCards] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les données du booster
  const fetchBoosterData = async () => {
    setError(null); // Réinitialiser les erreurs avant chaque nouvelle requête
    
    try {
      // Appel au backend pour obtenir les données du booster
      const response = await axios.get(`http://localhost:${API_PORT}/api/openBooster`, {
        params: { owner: userAddress }, // Vous pouvez envoyer l'adresse du propriétaire au backend
      });
      const boosterCards: CardProps[] = response.data; // Les données du backend

      setCards(boosterCards); // Mettre à jour les cartes dans le state
    } catch (error) {
      console.error('Erreur lors de la récupération des cartes :', error);
      setError("Erreur lors de la récupération des cartes.");
    } finally {
      setLoading(false);
    }
  };

  // Utiliser useEffect pour charger les données lors du montage du composant
  useEffect(() => {
    fetchBoosterData();
  }, [userAddress]); // Réexécuter si l'adresse du propriétaire change

  return (
    <div>
      <h2>Ouvrir un booster pour {userAddress}</h2>
      {loading ? (<p>Chargement des cartes...</p>) : 
        error ? (<p>{error}</p>) : (
        <div>
          {cards.length === 0 ? (<p>Aucune carte trouvée dans ce booster.</p>) : (
            <ul>
              {cards.map((card) => (
                <li key={card.id}>
                  <h3>{card.name}</h3>
                  <img src={card.images} alt={card.name} />
                  <p>Types: {card.types.join(', ')}</p>
                  <p>Prix moyen: {card.averagePrices} ETH</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default OpenBooster;
 