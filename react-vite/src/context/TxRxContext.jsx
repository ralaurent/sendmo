import { createContext, useState } from 'react';

export const TxRxContext = createContext();

export const TxRxProvider = ({ children }) => {
    const [tx, setTx] = useState({})
    const [rx, setRx] = useState({})

    return (
      <TxRxContext.Provider value={{ tx, setTx, rx, setRx }}>
        {children}
      </TxRxContext.Provider>
    );
  };
