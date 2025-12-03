import React from 'react';

const Block = ({ block }) => (
    <div className="block bg-gray-800/50 border border-green-500/30 rounded-md p-2 w-48 h-full flex-shrink-0 mr-4">
        <h4 className="text-xs text-green-300 font-mono">Block #{block.id}</h4>
        <div className="text-xs text-gray-400 mt-1 overflow-y-auto h-20">
            {block.txs.map(tx => (
                <div key={tx.id} className="truncate">
                    <span style={{ color: tx.color }}>■</span> {tx.id.slice(0, 10)}...
                </div>
            ))}
        </div>
    </div>
);

const BlockChain = ({ blocks }) => (
    <div className="w-full h-full p-2 rounded-lg border border-gray-700 bg-black/20">
        <h3 className="text-sm text-gray-400 p-2 font-mono">MINED BLOCKS</h3>
        <div className="flex w-full overflow-hidden">
            {blocks.map(block => (
                <Block key={block.id} block={block} />
            ))}
        </div>
    </div>
);

export default BlockChain;
