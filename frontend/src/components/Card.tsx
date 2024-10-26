import React from 'react';

// Interface pour la structure d'une carte
export interface CardProps {
    id: string;
    name: string;
    images: string;
    owner: string;
}

export const processCards = (cards: string[][]): CardProps[] => {
    const cardList: CardProps[] = [];
    for (let i = 0; i < cards.length; i++) {
        const cardData: CardProps = {
            id: cards[i][1],
            name: cards[i][0],
            images: cards[i][2],
            owner: ""
        };
        cardList.push(cardData);
    }

    return cardList;
}

// Composant réutilisable pour afficher une carte
export const Card: React.FC<{ card:CardProps }> = ({ card }) => {
    return (
        <div className="card-container">
            <img src={card.images} alt={card.name} />
            {card.owner ? <p><strong>Owner:</strong> {card.owner}</p> : null}
        </div>
    );
};