import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

import { CardProps, Card, processCards } from './Card';

const collectionNames = ['AdminCollection', 'Bpn1', 'Bpn2'];

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
      let cardList: CardProps[] = [];
      for (const collectionName of collectionNames) {
        const minted = await contract.getMinted(collectionName);
        const size = minted.length;
        const cardPromises = [];
        // Boucle pour récupérer chaque token détenu par le propriétaire
        for (let i = 0; i < size; i++) {
          // Récupérer l'ID du token détenu à un index spécifique)  
          if (minted[i].owner.toLowerCase() === userAddress.toLowerCase()) {
            cardPromises.push(minted[i]);
          }
        }
        const process = processCards(cardPromises);
        cardList = cardList.concat(process);
      }

      // Mettre à jour l'état avec la liste des cartes
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
