import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

import { CardProps, Card, processCards } from './Card';


const API_PORT = import.meta.env.VITE_API_PORT;

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
      const minted = await contract.getMinted();
      const size = minted.length;
      // console.log('Nombre de cartes détenu par le propriétaire :', balance.toNumber());
      const cardPromises = [];
      // Boucle pour récupérer chaque token détenu par le propriétaire
      let i;
      for (i = 0; i < size; i++) {
        // Récupérer l'ID du token détenu à un index spécifique)  
        if (minted[i].owner.toLowerCase() !== userAddress.toLowerCase()) {
          continue;
        }
        try {
          const response = await axios.get(`http://localhost:${API_PORT}/api/cards/getInfo/${i}`);
          const data = response.data;
          cardPromises.push(data);
        }
        catch (error) {
          console.error('Erreur lors de la récupération des informations de la carte :', error);
        }
      }

      // Mettre à jour l'état avec la liste des cartes
      const cardList = processCards(cardPromises);
      setCards(cardList);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des cartes :', error);
      setLoading(false);
    }
  };

  // Charger les cartes à partir de la blockchain
  // useEffect(() => {
  //   if (redeemed) {
  //     fetchOwnerCards();
  //   }
  // }, [redeemed]);

  useEffect(() => {
    fetchOwnerCards();
  }, []);

  // Affichage des cartes
  if (loading) {
    return <p>Chargement des cartes...</p>;
  }

  return (
    <div>
      <h1>Ma Collection</h1>
      {cards.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {Array.from({ length: cards.length }, (_, index) => (
            <li key={index}>
              <Card card={cards[index]} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Vous ne possédez aucune carte.</p>
      )}
    </div>
  );
};

export default MyCollection;
