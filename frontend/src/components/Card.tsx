import React from 'react';

// Interface pour la structure d'une carte
export interface CardProps {
    id: string;
    name: string;
    types: string[];
    set: {
        id: string;
        name: string;
        series: string;
        images: {
            small: string;
        };
    };
    averagePrices: number;
    images: {
        small: string;
    };
    owner: string;
}

// Composant réutilisable pour afficher une carte
export const Card: React.FC<CardProps> = (card) => {
    return (
        <div className="card-container">
            {/* Affiche le nom de la carte */}
            <h2>{card.name}</h2>

            {/* Affiche les types */}
            <p><strong>Types:</strong> {card.types.join(', ')}</p>

            {/* Affiche les informations du set */}
            <div className="card-set-info">
                <h4>Set Info</h4>
                <p><strong>ID:</strong> {card.set.id}</p>
                <p><strong>Name:</strong> {card.set.name}</p>
                <p><strong>Series:</strong> {card.set.series}</p>
                <img src={card.set.images.small} alt={`${card.set.name} Set`} />
            </div>

            {/* Affiche le prix moyen */}
            <p><strong>Average Price:</strong> ${card.averagePrices}</p>

            {/* Affiche l'image de la carte */}
            <img src={card.images.small} alt={card.name} />

            {/* Affiche le propriétaire de la carte */}
            <p><strong>Owner:</strong> {card.owner}</p>
        </div>
    );
};

// Styles pour le composant Card
const styles = {
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        margin: '10px',
        display: 'flex',
        alignItems: 'center',
        maxWidth: '400px',
    },
    image: {
        width: '80px',
        height: 'auto',
        marginRight: '20px',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
};
