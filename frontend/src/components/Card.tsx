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
export const Card: React.FC<CardProps> = ({ id, name, types, set, averagePrices, images, owner }) => {
    return (
        <div className="card-container" style={styles.card}>
            <img src={images.small} alt={name} style={styles.image} />
            <div>
                <h3>{name}</h3>
                <p>Types: {types.join(', ')}</p>
                <p>Set: {set.name} ({set.series})</p>
                <p>Prix moyen: {averagePrices} ETH</p>
                <p>Propriétaire: {owner}</p>
            </div>
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
