import React, { useEffect, useState } from 'react';
import axios from 'axios';

import * as main from '@/lib/main';
import { CardProps, Card, processCards } from './Card';


const API_PORT = import.meta.env.VITE_API_PORT;

const Album: React.FC<{contract: main.Main | undefined; isSuperAdmin: boolean; userAddress: string | null}> = ({ contract, isSuperAdmin, userAddress}) => {
  const [cards, setCards] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [toAddress, setToAddress] = useState(''); // Gérer l'état de l'input
  
  // Fonction pour récupérer les cartes détenues par le propriétaire
  const fetchAllCards = async () => {
    try {
      const response = await axios.get(`http://localhost:${API_PORT}/api/cards/all`);
      const cards: CardProps[] = processCards(response.data);
      setCards(cards.slice(10, cards.length));
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des cartes :', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(cards);
  }, [cards]);


  // Fonction pour gérer l'ajout ou la suppression d'une carte par ID
  const handleCardClick = (card: CardProps) => {
    const cardIndex = cards.indexOf(card);
    console.log('Card index:', cardIndex);
    
    if (selectedCards.includes(cardIndex)) {
        // Si la carte est déjà sélectionnée, on la retire de la liste par son index dans `cards`
        setSelectedCards(selectedCards.filter(index => index !== cardIndex));
    } else {
        // Sinon, on l'ajoute à la liste des cartes sélectionnées
        setSelectedCards([...selectedCards, cardIndex]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToAddress(e.target.value.toLowerCase());
  };

  const handleMintCards = async () => {
    console.log('Minting cards:', selectedCards);
    for (const cardNumber of selectedCards) {
        try {
            console.log(toAddress, cardNumber);
            const response = await axios.get(`http://localhost:${API_PORT}/api/cards/mint`, {
                params: {
                    address: toAddress,
                    card: cardNumber
                }
            });
            console.log('Minting successful:', response);
        } catch (error) {
            console.error('Error minting card:', error);
        }
    }
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
        <h1>{"Selected cards :" + selectedCards.length}</h1>
        <input
          type="text"
          value={toAddress}
          onChange={handleInputChange} // Met à jour la valeur de l'input
          placeholder="Saisissez quelque chose"
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <button onClick={handleMintCards} style={{ padding: '5px 10px' }}>
          Soumettre
        </button>
      </div>)}

      {/* Rendu des cartes */}
      {cards.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {cards.map((card) => (
            <li 
            key={card.id} 
            onClick={() => isSuperAdmin ? handleCardClick(card) : null} // Ajouter ou supprimer la carte si l'utilisateur est super-admin
            style={{ 
              cursor: 'pointer',
              padding: '10px', 
              border: isSuperAdmin 
                  ? (selectedCards.includes(cards.indexOf(card)) ? '2px solid blue' : '1px solid #ccc') 
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
