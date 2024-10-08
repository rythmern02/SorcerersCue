"use client"
// src/components/Game.js

import React, { useEffect, useState, useContext } from 'react';
import { WalletContext } from '../context/WalletContext';
import PoolTable from './PoolTable';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import idl from '../idl/sorcerers_cue.json';  // Import your Anchor IDL

const Game = () => {
    const { connectedWallet, connection } = useContext(WalletContext);
    const [gameState, setGameState] = useState(null);

    const programId = new PublicKey(idl.metadata.address); // Sorcerer's Cue Program ID
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        if (connection && connectedWallet) {
            // Create Anchor Provider
            const anchorProvider = new AnchorProvider(connection, connectedWallet, { commitment: 'processed' });
            setProvider(anchorProvider);
        }
    }, [connection, connectedWallet]);

    const fetchGameState = async () => {
        // Load Game State from Solana
        const program = new Program(idl, programId, provider);
        const gameAccount = await program.account.gameState.fetch(gameAccountPublicKey);
        setGameState(gameAccount);
    };

    const takeShot = async (shot) => {
        // Send transaction to Solana
        const program = new Program(idl, programId, provider);
        await program.rpc.takeShot(shot.power, shot.angle, {
            accounts: {
                gameAccount: gameAccountPublicKey,
                player: connectedWallet.publicKey,
            },
        });

        fetchGameState();
    };

    return (
        <div>
            <h1>Sorcerer's Cue</h1>
            {gameState && (
                <PoolTable balls={gameState.balls} cuePosition={gameState.cuePosition} takeShot={takeShot} />
            )}
        </div>
    );
};

export default Game;
