import React, { useEffect, useState } from 'react';
import axios from 'axios';

import * as main from '@/lib/main';
import { CardProps, Card } from './Card';
import { ethers } from 'ethers';


const API_PORT = import.meta.env.VITE_API_PORT;

const Album: React.FC<{contract: main.Main | undefined; isSuperAdmin: boolean; userAddress: string | null}> = ({ contract, isSuperAdmin, userAddress}) => {
  const [cards, setCards] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [toAddress, setToAddress] = useState(''); // Gérer l'état de l'input

  const allTypes = ['Metal', 'Grass', 'Colorless', 'Darkness', 'Lightning', 'Psychic', 'Fire', 'Water', 'Fighting', 'Dragon']
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

  // Fonction pour obtenir l'intersection des types entre allTypes et les types de la carte
  const getIntersectionOfTypes = (cardTypes: string[]): string[] => {
    let parsedCardTypes = [];

    // Parser les types de la carte si c'est une chaîne JSON
    if (typeof cardTypes === 'string') {
      parsedCardTypes = JSON.parse(cardTypes);
    } else {
      parsedCardTypes = cardTypes;
    }

    // Calculer l'intersection entre allTypes et les types de la carte
    return parsedCardTypes.filter((type: string) => allTypes.includes(type));
  };

  // Fonction pour gérer l'ajout ou la suppression d'une carte par ID
  const handleCardClick = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
        // Si la carte est déjà sélectionnée, on la retire de la liste
        setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else {
        // Sinon, on l'ajoute à la liste des cartes sélectionnées
        setSelectedCards([...selectedCards, cardId]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToAddress(e.target.value.toLowerCase());
  };

  const handleMintCards = async () => {
    if (!contract) {
      console.error('Contrat non initialisé');
      return;
    }
    console.log(contract);
    for (let i = 0; i < selectedCards.length; i++) {
      const card = cards.find(card => card.id === selectedCards[i]);
      if (card) {
        const collectionNames = getIntersectionOfTypes(card.types);
        for (let j = 0; j < collectionNames.length; j++) {
          const owner = contract.address;
          console.log('Owner:', owner);
          await contract.mintCardToUser(collectionNames[i], toAddress, 1);
        }
      }
    }
  }

  // Fonction pour gérer le clic sur le bouton
  const handleButtonClick = async () => {
    handleMintCards();
    console.log('Minted cards to address:', toAddress);
  };

  // Charger les cartes à partir de la blockchain
  useEffect(() => {
    fetchAllCards();
  }, []);

  useEffect(() => {
    setSelectedCards([]);
  }, [isSuperAdmin]);

  // Affichage des cartes
  if (loading) {
    return <p>Chargement des cartes...</p>;
  }

  return (
    <div>
      <h1>Album</h1>

      {/* Input et bouton */}
      {isSuperAdmin && (
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={toAddress}
          onChange={handleInputChange} // Met à jour la valeur de l'input
          placeholder="Saisissez quelque chose"
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <button onClick={handleButtonClick} style={{ padding: '5px 10px' }}>
          Soumettre
        </button>
      </div>)}

      {/* Rendu des cartes */}
      <h1>{"list length :" + selectedCards.length}</h1>
      {cards.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {cards.map((card) => (
            <li 
            key={card.id} 
            onClick={() => isSuperAdmin ? handleCardClick(card.id) : null} // Ajouter ou supprimer la carte si l'utilisateur est super-admin
            style={{ 
              cursor: 'pointer',
              padding: '10px', 
              border: isSuperAdmin 
                  ? (selectedCards.includes(card.id) ? '2px solid blue' : '1px solid #ccc') 
                  : 'none', // Aucune bordure si l'utilisateur n'est pas super-admin
              marginBottom: '5px'
            }}>
              <Card card={card} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune carte.</p>
      )}
    </div>
  );
};

export default Album;
