import React, { useState } from 'react';
import axios from 'axios';

const API_PORT = import.meta.env.VITE_API_PORT;

interface OpenBoosterProps {
  userAddress: string;
  redeemed: boolean;
  setRedeemed: (redeemed: boolean) => void;
}

const OpenBooster: React.FC<OpenBoosterProps> = ({ userAddress, redeemed, setRedeemed }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // // Utiliser useEffect pour charger les données lors du montage du composant
  // useEffect(() => {
  //   fetchBoosterData();
  // }, [userAddress]); // Réexécuter si l'adresse du propriétaire change

  // const fetchBoosterData = async () => {
  //   try {
  //     // Logique pour charger les données initiales si nécessaire
  //     // Par exemple, vérifier si le booster a déjà été utilisé
  //     setLoading(false);
  //   } catch (err) {
  //     setError('Erreur de chargement des données');
  //     setLoading(false);
  //   }
  // };

  const openBooster = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.post(`http://localhost:${API_PORT}/api/booster/open/${userAddress}`);
      setRedeemed(true);
    } catch (err) {
      setError('Erreur lors de l\'ouverture du booster');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Open Booster</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
        <button onClick={openBooster}>Open Booster</button>
        {redeemed ? <p>redeemed</p> : null}
    </div>
  );
};

export default OpenBooster;
