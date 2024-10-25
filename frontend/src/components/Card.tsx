import React from 'react';

// Interface pour la structure d'une carte
export interface CardProps {
    id: string;
    name: string;
    types: string[];
    collection_id: string;
    averagePrices: number;
    images: string;
    owner: string;
}

// Composant réutilisable pour afficher une carte
export const Card: React.FC<{ card:CardProps }> = ({ card }) => {
    return (
        <div className="card-container">
            {/* Affiche l'image de la carte */}
            <img src={card.images} alt={card.name} />

            {/* Affiche le propriétaire de la carte */}
            {card.owner ? <p><strong>Owner:</strong> {card.owner}</p> : null}
        </div>
    );
};

export default Card;