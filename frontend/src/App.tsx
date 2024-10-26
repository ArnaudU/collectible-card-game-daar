import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './styles.module.css'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'

import Navbar from './components/Navbar'
import MyCollection from './components/MyCollection';
import OpenBooster from './components/OpenBooster';
import Album from './components/Album';

type Canceler = () => void
const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>()
  useEffect(() => {
    asyncEffect()
      .then(canceler => (cancelerRef.current = canceler))
      .catch(error => console.warn('Uncatched error', error))
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current()
        cancelerRef.current = undefined
      }
    }
  }, dependencies)
}

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>()
  const [contract, setContract] = useState<main.Main>()
  useAffect(async () => {
    const details_ = await ethereum.connect('metamask')
    if (!details_) return
    setDetails(details_)
    const contract_ = await main.init(details_)
    if (!contract_) return
    setContract(contract_)
  }, [])
  return useMemo(() => {
    if (!details || !contract) return
    return { details, contract }
  }, [details, contract])
}



export const App: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [redeemed, setRedeemed] = useState<boolean>(false);
  

  const wallet = useWallet()
  const provider = wallet?.details.provider;
  
  // Instancier le contrat ERC721
  const contract = wallet?.contract
  const superAdminAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'.toLowerCase();
  var isSuperAdmin = superAdminAddress === userAddress;

  useEffect(() => {
    if (wallet && wallet.details) {
      // Si wallet.details.account est undefined, setUserAddress recevra null
      setUserAddress(wallet.details.account?.toLowerCase() ?? null); 
    }
    ethereum.accountsChanged(accounts => {
      setUserAddress(accounts[0].toLowerCase());
    });
  }, [provider]);

  useEffect(() => {
      isSuperAdmin = userAddress === superAdminAddress;
  }, [userAddress]);


  return (
    <div className={styles.body}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Album contract={contract} isSuperAdmin={isSuperAdmin} userAddress={userAddress}/>} />
          <Route path="/my-collection" element={userAddress ? <MyCollection contract={contract} userAddress={userAddress} redeemed={redeemed} /> : <p>Aucune adresse propriétaire trouvée</p>}/>
          <Route path="/booster" element={userAddress ? <OpenBooster userAddress={userAddress} redeemed={redeemed} setRedeemed={setRedeemed} /> : <p>Aucune adresse propriétaire trouvée</p>}/>
        </Routes>
      </Router>
    </div>
  )
}

// import axios from "axios";
// import { useEffect } from "react";

// export const App = () => {
//   useEffect(() => {
//     axios.get("http://localhost:3000/api/test").then((response) => {
//       console.log(response.data);
//     });
//   }, []);
// };