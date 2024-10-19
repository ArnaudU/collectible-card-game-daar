import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav style={styles.navbar}>
            <div style={styles.logo}>
                <h1>Pokemon TCG</h1>
            </div>
            <div style={styles.links}>
                <ul style={styles.link}>Accueil</ul>
                <ul style={styles.link}>Ma Collection</ul>
                <ul style={styles.link}>Marketplace</ul>
                <ul style={styles.link}>À Propos</ul>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#282c34',
        color: '#ffffff',
    },
    logo: {
        fontSize: '1.5rem',
    },
    links: {
        display: 'flex',
        gap: '1rem',
    },
    link: {
        color: '#61dafb',
        textDecoration: 'none',
        fontSize: '1rem',
        listStyle: 'none',
    },
};

export default Navbar;
