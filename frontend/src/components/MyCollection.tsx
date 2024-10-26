import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

import { CardProps } from './Card';


const API_PORT = import.meta.env.API_PORT;

interface MyCollectionProps {
  contract: ethers.Contract; 
  userAddress: string;
  redeemed: boolean;
}

const MyCollection: React.FC<MyCollectionProps> = ({ contract, userAddress, redeemed }) => {
  const [cards, setCards] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fonction pour récupérer les cartes détenues par le propriétaire
  const fetchOwnerCards = async () => {
    try {
      console.log(contract);
      // Récupérer le nombre de cartes détenues par le propriétaire
      const balance = await contract.balanceOf(userAddress);
      console.log('Nombre de cartes détenu par le propriétaire :', balance.toNumber());
      const cardPromises = [];
      // Boucle pour récupérer chaque token détenu par le propriétaire
      for (let i = 0; i < balance.toNumber(); i++) {
        // Récupérer l'ID du token détenu à un index spécifique)
        const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
        try {
          const response = await axios.get(`http://localhost:${API_PORT}/api/cards/getInfo/${tokenId}`);
          const card: CardProps = response.data;
          cardPromises.push(card);
        }
        catch (error) {
          console.error('Erreur lors de la récupération des informations de la carte :', error);
        }
      }

      // Mettre à jour l'état avec la liste des cartes
      const cardList = await Promise.all(cardPromises);
      setCards(cardList);
      console.log('Cartes récupérées :', cardList);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des cartes :', error);
      setLoading(false);
    }
  };

  // Charger les cartes à partir de la blockchain
  useEffect(() => {
    if (redeemed) {
      fetchOwnerCards();
    }
  }, [redeemed]);

  // Affichage des cartes
  if (loading) {
    return <p>Chargement des cartes...</p>;
  }

  return (
    <div>
      <h1>Ma Collection</h1>
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

export default MyCollection;
