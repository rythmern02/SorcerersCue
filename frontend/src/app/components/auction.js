"use client"
// src/components/Auction.js
import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../context/WalletContext';
import { Program, AnchorProvider } from '@project-serum/anchor';
import idl from '../idl/auction_program.json';  // Auction program IDL

const Auction = () => {
    const { connectedWallet, connection } = useContext(WalletContext);
    const [auctions, setAuctions] = useState([]);

    const auctionProgramId = new PublicKey(idl.metadata.address); 

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        const provider = new AnchorProvider(connection, connectedWallet, { commitment: 'processed' });
        const program = new Program(idl, auctionProgramId, provider);
        
        const allAuctions = await program.account.auctionState.all();
        setAuctions(allAuctions);
    };

    return (
        <div>
            <h1>In-Game Auctions</h1>
            <div>
                {auctions.map(auction => (
                    <div key={auction.publicKey.toBase58()}>
                        <h2>{auction.itemName}</h2>
                        <p>Current Bid: {auction.currentBid}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Auction;
