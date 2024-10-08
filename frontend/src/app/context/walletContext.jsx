// src/context/WalletContext.js

import React, { createContext, useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

export const WalletContext = createContext();

export const WalletProviderComponent = ({ children }) => {
    const wallet = useWallet();
    const [connectedWallet, setConnectedWallet] = useState(null);
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        if (wallet && wallet.publicKey) {
            setConnectedWallet(wallet);
            const conn = new Connection('https://api.mainnet-beta.solana.com');
            setConnection(conn);
        }
    }, [wallet]);

    return (
        <WalletContext.Provider value={{ connectedWallet, connection }}>
            {children}
        </WalletContext.Provider>
    );
};
