import React from 'react';

const Mempool = ({ txs }) => {
    return (
        <div className="relative w-full h-full border border-purple-500/30 rounded-lg bg-black/20 overflow-hidden">
            <div className="absolute top-2 left-3 text-purple-300 font-mono text-sm">MEMPOOL [PENDING TXs]</div>
            {txs.map(tx => (
                <div
                    key={tx.id}
                    className={`mempool-bubble absolute rounded-full border ${tx.isConfirming ? 'fly-to-block' : ''}`}
                    style={{
                        width: `${tx.size}px`,
                        height: `${tx.size}px`,
                        left: `${tx.x}%`,
                        top: `${tx.y}%`,
                        borderColor: tx.color,
                        backgroundColor: `${tx.color}20`, // 20% opacity
                        animationDelay: `${tx.delay}s`,
                        boxShadow: `0 0 ${tx.size / 2}px ${tx.color}`,
                    }}
                />
            ))}
        </div>
    );
};

export default Mempool;
