import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styles from './styles.module.css'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'

import Navbar from './components/Navbar'
import MyCollection from './components/MyCollection';
import OpenBooster from './components/OpenBooster';

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
  const wallet = useWallet()
  const ownerAddress = wallet?.details.account
  const contractAddress = main.myShip()
  return (
    <div className={styles.body}>
      <p>${wallet?.details.account}</p>
      {/* <Router>
        <Navbar />
        <Routes>
          <Route path="/my-collection" element={ownerAddress ? <MyCollection contractAddress={contractAddress} ownerAddress={ownerAddress} /> : <p>Aucune adresse propriétaire trouvée</p>}/>
          <Route path="/booster" element={ownerAddress ? <OpenBooster ownerAddress={ownerAddress} /> : <p>Aucune adresse propriétaire trouvée</p>}/>
        </Routes>
      </Router> */}
    </div>
  )
}
