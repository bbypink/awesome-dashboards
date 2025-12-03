import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Mempool from './components/Mempool';
import BlockChain from './components/BlockChain';
import NetworkStatistic from './components/NetworkStatistic';

const FEE_COLORS = ["#f87171", "#fb923c", "#facc15", "#a3e635", "#4ade80"];

// --- SIMULATION LOGIC ---
const App = () => {
    const [mempoolTxs, setMempoolTxs] = useState([]);
    const [minedBlocks, setMinedBlocks] = useState([]);
    const [stats, setStats] = useState({ hashRate: 123.45, baseFee: 21.3, priorityFee: 3.1 });

    useEffect(() => {
        // Add new transactions to mempool periodically
        const txInterval = setInterval(() => {
            const feeTier = Math.floor(Math.random() * 5);
            const newTx = {
                id: `0x${(Math.random().toString(16) + '000000000').slice(2, 12)}`,
                fee: 5 - feeTier,
                size: Math.random() * 15 + 10,
                color: FEE_COLORS[feeTier],
                x: Math.random() * 90 + 5,
                y: Math.random() * 90 + 5,
                delay: Math.random() * 10,
                isConfirming: false,
            };
            setMempoolTxs(prev => [...prev, newTx].slice(-100)); // Keep max 100 txs
        }, 400);

        // Mine a new block periodically
        const blockInterval = setInterval(() => {
            setMempoolTxs(prevTxs => {
                const txsToMine = prevTxs
                    .sort((a, b) => b.fee - a.fee)
                    .slice(0, 5);
                
                const remainingTxs = prevTxs.filter(tx => !txsToMine.find(mined => mined.id === tx.id));
                const confirmingTxs = prevTxs.filter(tx => txsToMine.find(mined => mined.id === tx.id));

                // Trigger exit animation
                confirmingTxs.forEach(tx => tx.isConfirming = true);
                
                const newBlock = {
                    id: (minedBlocks.length > 0 ? minedBlocks[0].id + 1 : 684321),
                    txs: txsToMine,
                };
                
                // After animation, clean up the mempool
                setTimeout(() => {
                    setMempoolTxs(currentTxs => currentTxs.filter(tx => !tx.isConfirming));
                }, 1000);

                setMinedBlocks(prevBlocks => [newBlock, ...prevBlocks].slice(0, 5));
                return [...remainingTxs, ...confirmingTxs];
            });
        }, 4000);

        // Update stats periodically
        const statsInterval = setInterval(() => {
            setStats(prev => ({
                hashRate: Math.max(100, prev.hashRate + (Math.random() - 0.5) * 5),
                baseFee: Math.max(10, prev.baseFee + (Math.random() - 0.5) * 2),
                priorityFee: Math.max(1, prev.priorityFee + (Math.random() - 0.5) * 1),
            }));
        }, 2000);

        return () => {
            clearInterval(txInterval);
            clearInterval(blockInterval);
            clearInterval(statsInterval);
        };
    }, [minedBlocks]);

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans flex flex-col hex-bg">
            <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full flex-grow flex flex-col">
                <Header />
                
                <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 grid-rows-3 gap-6 mt-6 h-0">
                    
                    <div className="lg:col-span-2 row-span-2">
                        <Mempool txs={mempoolTxs} />
                    </div>

                    <div className="lg:col-span-1 row-span-2 flex flex-col gap-6">
                        <NetworkStatistic label="Network Hash Rate" value={stats.hashRate.toFixed(2)} unit=" EH/s" />
                        <NetworkStatistic label="Base Fee" value={stats.baseFee.toFixed(1)} unit=" gwei" colorClass="text-purple-400" />
                        <NetworkStatistic label="Priority Fee" value={stats.priorityFee.toFixed(1)} unit=" gwei" colorClass="text-amber-400" />
                    </div>
                    
                    <div className="lg:col-span-3 row-span-1">
                        <BlockChain blocks={minedBlocks} />
                    </div>

                </main>
            </div>
        </div>
    );
}

export default App;
