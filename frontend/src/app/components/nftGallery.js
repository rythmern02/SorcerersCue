"use client"
// src/components/NFTGallery.js

import React, { useContext, useEffect, useState } from 'react';
import { Metaplex, keypairIdentity } from '@metaplex/js';
import { WalletContext } from '../context/WalletContext';

const NFTGallery = () => {
    const { connectedWallet } = useContext(WalletContext);
    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        if (connectedWallet) {
            loadNFTs();
        }
    }, [connectedWallet]);

    const loadNFTs = async () => {
        const metaplex = Metaplex.make(connection).use(keypairIdentity(connectedWallet));
        const userNfts = await metaplex.nfts().findAllByOwner({ owner: connectedWallet.publicKey });
        setNfts(userNfts);
    };

    return (
        <div>
            <h2>Your NFTs</h2>
            <div className="nft-gallery">
                {nfts.map(nft => (
                    <div key={nft.mintAddress.toBase58()}>
                        <img src={nft.metadataUri} alt={nft.name} />
                        <h3>{nft.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NFTGallery;
